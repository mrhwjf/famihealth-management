package com.famihealth.family_health_management.service.impl;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.appointment.AppointmentCreateRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentFilterRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentUpdateRequest;
import com.famihealth.family_health_management.dto.response.appointment.AppointmentDto;
import com.famihealth.family_health_management.dto.response.appointment.AppointmentFormDto;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.dto.response.common.FilterOptionDto;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.enums.AppointmentStatus;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.mapper.AppointmentMapper;
import com.famihealth.family_health_management.model.Appointment;
import com.famihealth.family_health_management.model.Family;
import com.famihealth.family_health_management.model.FamilyAccess;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.AppointmentRepository;
import com.famihealth.family_health_management.repository.FamilyAccessRepository;
import com.famihealth.family_health_management.repository.FamilyMemberRepository;
import com.famihealth.family_health_management.repository.MemberAccessRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.AppointmentService;
import com.famihealth.family_health_management.service.SessionService;
import com.famihealth.family_health_management.specs.AppointmentSpecs;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

	private static final String ROLE_FAMILY = "FAMILY";
	private static final String ROLE_DOCTOR = "DOCTOR";

	private final AppointmentRepository appointmentRepository;
	private final FamilyMemberRepository familyMemberRepository;
	private final FamilyAccessRepository familyAccessRepository;
	private final MemberAccessRepository memberAccessRepository;
	private final UserRepository userRepository;
	private final AppointmentMapper appointmentMapper;
	private final SessionService sessionService;

	@Override
	public AppointmentDto createAppointment(String sessionId, AppointmentCreateRequest request) {
		SessionData session = requireSession(sessionId);
		ensureSupportedRole(session);

		FamilyMember patient = requireFamilyMember(request.getPatientId());
		User doctor = requireDoctor(request.getDoctorId());
		ensureDoctorUser(doctor);

		if (isFamily(session)) {
			ensureFamilyAccess(session, patient);
			ensureDoctorLinkedToMember(doctor.getId(), patient.getId());
			if (request.getStatus() == AppointmentStatus.COMPLETED) {
				throw new ForbiddenException("Family accounts cannot mark appointments as completed");
			}
		} else {
			ensureDoctorAccess(session, patient);
			if (!doctor.getId().equals(session.getUserId())) {
				throw new ForbiddenException("Doctors may only create appointments for themselves");
			}
			if (request.getStatus() == AppointmentStatus.COMPLETED) {
				throw new ForbiddenException("Use the completion endpoint to mark appointments as completed");
			}
		}

		Appointment appointment = appointmentMapper.toEntity(request);
		appointment.setPatient(patient);
		appointment.setDoctor(doctor);
		appointment.setIssuer(requireUser(session.getUserId()));
		appointment.setStatus(resolveInitialStatus(request));

		Appointment saved = appointmentRepository.save(appointment);
		return appointmentMapper.toDto(saved);
	}

	@Override
	@Transactional(readOnly = true)
	public AppointmentDto getAppointmentById(String sessionId, Integer appointmentId) {
		SessionData session = requireSession(sessionId);
		ensureSupportedRole(session);

		Appointment appointment = requireAppointment(appointmentId);
		ensureCanView(session, appointment);
		return appointmentMapper.toDto(appointment);
	}

	@Override
	public AppointmentDto updateAppointment(String sessionId, Integer appointmentId, AppointmentUpdateRequest request) {
		SessionData session = requireSession(sessionId);
		ensureSupportedRole(session);

		Appointment appointment = requireAppointment(appointmentId);
		FamilyMember patient = requirePatient(appointment);

		if (isFamily(session)) {
			ensureFamilyAccess(session, patient);
			applyFamilyUpdate(appointment, request);
		} else {
			ensureDoctorAccess(session, patient);
			ensureDoctorOwnsAppointment(session, appointment);
			applyDoctorUpdate(appointment, request);
		}

		Appointment saved = appointmentRepository.save(appointment);
		return appointmentMapper.toDto(saved);
	}

	@Override
	public void deleteAppointment(String sessionId, Integer appointmentId) {
		SessionData session = requireSession(sessionId);
		ensureSupportedRole(session);

		Appointment appointment = requireAppointment(appointmentId);
		FamilyMember patient = requirePatient(appointment);

		if (isFamily(session)) {
			ensureFamilyAccess(session, patient);
		} else {
			ensureDoctorAccess(session, patient);
			ensureDoctorOwnsAppointment(session, appointment);
		}

		appointmentRepository.delete(appointment);
	}

	@Override
	public AppointmentDto markAppointmentCompleted(String sessionId, Integer appointmentId) {
		SessionData session = requireSession(sessionId);
		ensureDoctorRole(session);

		Appointment appointment = requireAppointment(appointmentId);
		FamilyMember patient = requirePatient(appointment);

		ensureDoctorAccess(session, patient);
		ensureDoctorOwnsAppointment(session, appointment);

		if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
			throw new BadRequestException("Cannot complete a cancelled appointment");
		}

		appointment.setStatus(AppointmentStatus.COMPLETED);
		Appointment saved = appointmentRepository.save(appointment);
		return appointmentMapper.toDto(saved);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<AppointmentDto> getAppointments(String sessionId, AppointmentFilterRequest req,
			Pageable pageable) {
		SessionData session = requireSession(sessionId);
		ensureSupportedRole(session);

		Set<Integer> accessibleIds = null;
		if (isFamilyCreator(session)) {
			accessibleIds = familyMemberRepository.findIdByFamily_Id(session.getUserId());
		} else if (isFamily(session)) {
			accessibleIds = Set.of(session.getUserId());
		} else if (isDoctor(session)) {
			accessibleIds = appointmentRepository.findPatientIdsByDoctorId(session.getUserId());
		}

		Specification<Appointment> spec = AppointmentSpecs.byFilter(req, accessibleIds);
		Page<Appointment> page = appointmentRepository.findAll(spec, pageable);

		return PageResponseMapper.fromPage(page, appointmentMapper::toDto);

	}

	@Override
	@Transactional(readOnly = true)
	public AppointmentFormDto getAppointmentCreateFormData(String sessionId) {
		return getAppointmentFormData(sessionId);
	}

	@Override
	@Transactional(readOnly = true)
	public AppointmentFormDto getAppointmentEditFormData(String sessionId, Integer appointmentId) {
		SessionData session = requireSession(sessionId);
		ensureSupportedRole(session);

		Appointment appointment = requireAppointment(appointmentId);
		ensureCanView(session, appointment);

		AppointmentFormDto formData = getAppointmentFormData(sessionId);
		formData.setAppointment(appointmentMapper.toDto(appointment));
		return formData;
	}

	@Transactional(readOnly = true)
	private AppointmentFormDto getAppointmentFormData(String sessionId) {
		SessionData session = requireSession(sessionId);
		ensureSupportedRole(session);

		List<FamilyMember> familyMembers = List.of();
		List<User> doctors = List.of();

		if (isFamily(session)) {
			// Family: get all family members for this user
			familyMembers = familyMemberRepository.findByFamily_Id(session.getUserId());

			// Doctors linked to this family
			doctors = userRepository.findDistinctByFamilyAccesses_FamilyIdAndRole_Name(session.getUserId(),
					ROLE_DOCTOR);
		} else if (isDoctor(session)) {
			// Doctor: get all patients linked to this doctor
			familyMembers = familyMemberRepository.findDistinctByMemberAccesses_DoctorId(session.getUserId());
		}

		Set<AppointmentStatus> statuses = EnumSet.allOf(AppointmentStatus.class);

		return appointmentMapper.toFormDto(familyMembers, doctors, statuses, null);
	}

	@Override
	@Transactional(readOnly = true)
	public FilterOptionDto getAppointmentFilterOptions(String sessionId) {
		SessionData session = requireSession(sessionId);
		ensureSupportedRole(session);

		List<FamilyMember> familyMembers = List.of();
		List<User> doctors = List.of();

		if (isFamily(session)) {
			// Family: get all family members for this user
			familyMembers = familyMemberRepository.findByFamily_Id(session.getUserId());

			// Doctors linked to this family
			doctors = userRepository.findDistinctByFamilyAccesses_FamilyIdAndRole_Name(session.getUserId(),
					ROLE_DOCTOR);
		} else if (isDoctor(session)) {
			// Doctor: get all patients linked to this doctor
			familyMembers = familyMemberRepository.findDistinctByMemberAccesses_DoctorId(session.getUserId());
		}

		Set<AppointmentStatus> statuses = EnumSet.allOf(AppointmentStatus.class);

		// 1. Dropdowns: patient (id name pair)
		List<FilterOptionDto.DropdownOption> patientOptions = familyMembers.stream()
				.map(member -> new FilterOptionDto.DropdownOption(
						member.getId(), // value
						member.getName(), // label
						null // optional description
				))
				.toList();
		FilterOptionDto.DropdownFilterOption patientDropdown = new FilterOptionDto.DropdownFilterOption(
				"patientId", // field name
				"Patient", // label
				patientOptions,
				false // multiSelect
		);

		// 2. Dropdowns: doctor (id name pair)
		List<FilterOptionDto.DropdownOption> doctorOptions = doctors.stream()
				.map(doctor -> new FilterOptionDto.DropdownOption(
						doctor.getId(), // value
						doctor.getName(), // label
						null // optional description
				))
				.toList();
		FilterOptionDto.DropdownFilterOption doctorDropdown = new FilterOptionDto.DropdownFilterOption(
				"doctorId", // field name
				"Doctor", // label
				doctorOptions,
				false // multiSelect
		);

		// 3. Dropdowns: status
		List<FilterOptionDto.DropdownOption> statusOptions = statuses.stream()
				.map(status -> new FilterOptionDto.DropdownOption(
						status.name(), // value
						status.name(), // label
						null // optional description
				))
				.toList();
		FilterOptionDto.DropdownFilterOption statusDropdown = new FilterOptionDto.DropdownFilterOption(
				"status", // field name
				"Status", // label
				statusOptions,
				false // multiSelect
		);

		// 4. Compose the final FilterOptionDto
		return new FilterOptionDto(
				List.of(patientDropdown, doctorDropdown, statusDropdown) // dropdowns
				, List.of() // booleans
				, List.of() // dateRanges
				, List.of() // searchableFields
		);

	}

	private void applyFamilyUpdate(Appointment appointment, AppointmentUpdateRequest request) {
		if (request.getAppointmentDatetime() != null) {
			appointment.setAppointmentDatetime(request.getAppointmentDatetime());
		}
		if (request.getLocation() != null) {
			appointment.setLocation(request.getLocation());
		}
		if (request.getNotes() != null) {
			appointment.setNotes(request.getNotes());
		}
		if (request.getStatus() != null) {
			if (request.getStatus() == AppointmentStatus.COMPLETED) {
				throw new ForbiddenException("Family accounts cannot mark appointments as completed");
			}
			appointment.setStatus(request.getStatus());
		}
	}

	private void applyDoctorUpdate(Appointment appointment, AppointmentUpdateRequest request) {
		if (request.getAppointmentDatetime() != null) {
			appointment.setAppointmentDatetime(request.getAppointmentDatetime());
		}
		if (request.getLocation() != null) {
			appointment.setLocation(request.getLocation());
		}
		if (request.getNotes() != null) {
			appointment.setNotes(request.getNotes());
		}
		if (request.getStatus() != null) {
			if (request.getStatus() == AppointmentStatus.COMPLETED) {
				throw new ForbiddenException("Use the completion endpoint to mark appointments as completed");
			}
			appointment.setStatus(request.getStatus());
		}
	}

	private AppointmentStatus resolveInitialStatus(AppointmentCreateRequest request) {
		AppointmentStatus requested = request.getStatus();
		if (requested == null || requested == AppointmentStatus.COMPLETED) {
			return AppointmentStatus.SCHEDULED;
		}
		return requested;
	}

	private void ensureCanView(SessionData session, Appointment appointment) {
		FamilyMember patient = requirePatient(appointment);
		if (isFamily(session)) {
			ensureFamilyAccess(session, patient);
			return;
		}

		if (isDoctor(session)) {
			if (memberAccessRepository.existsByMemberIdAndDoctorId(patient.getId(), session.getUserId())) {
				return;
			}
		}

		throw new ForbiddenException("Access denied for appointment");
	}

	private void ensureDoctorOwnsAppointment(SessionData session, Appointment appointment) {
		User doctor = appointment.getDoctor();
		if (doctor == null || doctor.getId() == null || !doctor.getId().equals(session.getUserId())) {
			throw new ForbiddenException("Doctor is not assigned to this appointment");
		}
	}

	private void ensureFamilyAccess(SessionData session, FamilyMember patient) {
		Family family = patient.getFamily();
		if (family == null || family.getId() == null) {
			throw new BadRequestException("Family member is not linked to a family");
		}
		boolean hasAccess = familyAccessRepository.existsByFamilyIdAndUserId(family.getId(), session.getUserId());
		if (!hasAccess) {
			throw new ForbiddenException("User does not have access to this family member");
		}
	}

	private void ensureDoctorAccess(SessionData session, FamilyMember patient) {
		ensureDoctorRole(session);
		ensureDoctorLinkedToMember(session.getUserId(), patient.getId());
	}

	private void ensureDoctorLinkedToMember(Integer doctorId, Integer memberId) {
		if (!memberAccessRepository.existsByMemberIdAndDoctorId(memberId, doctorId)) {
			throw new ForbiddenException("Doctor does not have access to this family member");
		}
	}

	private void ensureSupportedRole(SessionData session) {
		String role = session.getRole();
		if (role == null || (!ROLE_FAMILY.equalsIgnoreCase(role) && !ROLE_DOCTOR.equalsIgnoreCase(role))) {
			throw new ForbiddenException("Unsupported role for appointment operations");
		}
	}

	private void ensureDoctorRole(SessionData session) {
		if (!isDoctor(session)) {
			throw new ForbiddenException("Only doctors can perform this action");
		}
	}

	private boolean isFamily(SessionData session) {
		return ROLE_FAMILY.equalsIgnoreCase(session.getRole());
	}

	private boolean isFamilyCreator(SessionData session) {
		if (!isFamily(session)) {
			return false;
		}
		List<FamilyAccess> accesses = familyAccessRepository.findByUserId(session.getUserId());
		if (accesses == null || accesses.isEmpty()) {
			throw new ForbiddenException("Family access record not found");
		}
		FamilyAccess access = accesses.get(0);
		if (access.getFamily() == null || access.getFamily().getCreator() == null) {
			throw new ForbiddenException("Family or creator information is missing");
		}
		return access.getFamily().getCreator().getId().equals(session.getUserId());
	}

	private boolean isDoctor(SessionData session) {
		return ROLE_DOCTOR.equalsIgnoreCase(session.getRole());
	}

	private SessionData requireSession(String sessionId) {
		return sessionService.getSession(sessionId)
				.orElseThrow(() -> new ForbiddenException("Invalid or expired session"));
	}

	private Appointment requireAppointment(Integer appointmentId) {
		return appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new NotFoundException("Appointment not found"));
	}

	private FamilyMember requireFamilyMember(Integer memberId) {
		return familyMemberRepository.findById(memberId)
				.orElseThrow(() -> new NotFoundException("Family member not found"));
	}

	private User requireDoctor(Integer doctorId) {
		return userRepository.findById(doctorId)
				.orElseThrow(() -> new NotFoundException("Doctor not found"));
	}

	private User requireUser(Integer userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("User not found"));
	}

	private FamilyMember requirePatient(Appointment appointment) {
		FamilyMember patient = appointment.getPatient();
		if (patient == null || patient.getId() == null) {
			throw new BadRequestException("Appointment is not linked to a valid patient");
		}
		return patient;
	}

	private void ensureDoctorUser(User doctor) {
		if (doctor.getRole() == null || !ROLE_DOCTOR.equalsIgnoreCase(doctor.getRole().getName())) {
			throw new BadRequestException("Selected user is not a doctor");
		}
	}
}
