package com.famihealth.family_health_management.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.medical_document.MedicalDocumentCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_document.MedicalDocumentUpdateRequest;
import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.medical_document.MedicalDocumentDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordDetailDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordFormDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordSummaryDto;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.mapper.MedicalDocumentMapper;
import com.famihealth.family_health_management.mapper.MedicalRecordMapper;
import com.famihealth.family_health_management.model.Facility;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.model.MedicalDocument;
import com.famihealth.family_health_management.model.MedicalRecord;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.FacilityRepository;
import com.famihealth.family_health_management.repository.FamilyMemberRepository;
import com.famihealth.family_health_management.repository.MedicalDocumentRepository;
import com.famihealth.family_health_management.repository.MedicalRecordRepository;
import com.famihealth.family_health_management.repository.MemberAccessRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.MedicalRecordService;
import com.famihealth.family_health_management.service.SessionService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordServiceImpl implements MedicalRecordService {

	private static final String ROLE_FAMILY = "FAMILY";
	private static final String ROLE_DOCTOR = "DOCTOR";

	private final MedicalRecordRepository medicalRecordRepository;
	private final MedicalDocumentRepository medicalDocumentRepository;
	private final FamilyMemberRepository familyMemberRepository;
	private final FacilityRepository facilityRepository;
	private final UserRepository userRepository;
	private final MemberAccessRepository memberAccessRepository;
	private final SessionService sessionService;
	private final MedicalRecordMapper medicalRecordMapper;
	private final MedicalDocumentMapper medicalDocumentMapper;

	@Override
	@Transactional
	public MedicalRecordDetailDto createRecord(String sessionId, MedicalRecordCreateRequest request) {
		SessionData session = requireSession(sessionId);
		FamilyMember member = requireFamilyMember(request.getFamilyMemberId());

		ensureCanCreateOrUpdate(session, member, true);

		// Convert record fields
		MedicalRecord record = medicalRecordMapper.toEntity(request);
		record.setFamilyMember(member);
		record.setFacility(resolveFacility(request.getFacilityId()));

		// Creator doctor (if any)
		if (isDoctor(session)) {
			record.setDoctor(requireUser(session.getUserId()));
		} else {
			record.setDoctor(null);
		}

		// Bulk document creation (safe because all docs are new)
		if (request.getDocuments() != null && !request.getDocuments().isEmpty()) {
			List<MedicalDocument> documents = request.getDocuments().stream()
					.map(medicalDocumentMapper::toEntity)
					.peek(doc -> doc.setMedicalRecord(record))
					.toList();

			record.setDocuments(documents);
		} else {
			record.setDocuments(new ArrayList<>());
		}

		MedicalRecord saved = medicalRecordRepository.save(record);
		return medicalRecordMapper.toDetailDto(saved);
	}

	@Override
	@Transactional(readOnly = true)
	public MedicalRecordDetailDto getRecordById(String sessionId, Integer recordId) {
		SessionData session = requireSession(sessionId);
		MedicalRecord record = requireMedicalRecord(recordId);
		ensureCanView(session, record);
		return medicalRecordMapper.toDetailDto(record);
	}

	@Override
	public MedicalRecordDetailDto updateRecord(String sessionId, Integer recordId,
			MedicalRecordUpdateRequest request) {
		SessionData session = requireSession(sessionId);
		MedicalRecord record = requireMedicalRecord(recordId);
		ensureCanModify(session, record);

		medicalRecordMapper.updateEntityFromDto(request, record);
		if (request.getFacilityId() != null) {
			record.setFacility(resolveFacility(request.getFacilityId()));
		}

		MedicalRecord saved = medicalRecordRepository.save(record);
		return medicalRecordMapper.toDetailDto(saved);
	}

	@Override
	public void deleteRecord(String sessionId, Integer recordId) {
		SessionData session = requireSession(sessionId);
		MedicalRecord record = requireMedicalRecord(recordId);
		ensureCanModify(session, record);
		List<MedicalDocument> documents = medicalDocumentRepository.findByMedicalRecord_Id(recordId);
		medicalDocumentRepository.deleteAll(documents);
		medicalRecordRepository.delete(record);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<MedicalRecordSummaryDto> getRecordsByFamilyMember(String sessionId, Integer familyMemberId,
			Pageable pageable) {
		SessionData session = requireSession(sessionId);
		FamilyMember member = requireFamilyMember(familyMemberId);
		ensureCanView(session, member);

		Page<MedicalRecord> recordsPage = medicalRecordRepository.findByFamilyMember_Id(familyMemberId, pageable);
		return PageResponseMapper.fromPage(recordsPage, medicalRecordMapper::toSummaryDto);
	}

	@Override
	public MedicalDocumentDto createDocument(String sessionId, Integer recordId, MedicalDocumentCreateRequest request) {
		SessionData session = requireSession(sessionId);
		MedicalRecord record = requireMedicalRecord(recordId);
		ensureCanModify(session, record);

		MedicalDocument document = medicalDocumentMapper.toEntity(request);
		document.setMedicalRecord(record);
		MedicalDocument saved = medicalDocumentRepository.save(document);
		return medicalDocumentMapper.toDto(saved);
	}

	@Override
	public MedicalDocumentDto updateDocument(String sessionId, Integer documentId,
			MedicalDocumentUpdateRequest request) {
		SessionData session = requireSession(sessionId);
		MedicalDocument document = requireMedicalDocument(documentId);
		MedicalRecord record = document.getMedicalRecord();
		ensureCanModify(session, record);

		medicalDocumentMapper.updateEntityFromDto(request, document);
		MedicalDocument saved = medicalDocumentRepository.save(document);
		return medicalDocumentMapper.toDto(saved);
	}

	@Override
	public void deleteDocument(String sessionId, Integer documentId) {
		SessionData session = requireSession(sessionId);
		MedicalDocument document = requireMedicalDocument(documentId);
		MedicalRecord record = document.getMedicalRecord();
		ensureCanModify(session, record);
		medicalDocumentRepository.delete(document);
	}

	@Override
	@Transactional(readOnly = true)
	public MedicalRecordFormDto getMedicalRecordCreateForm(String sessionId) {
		SessionData session = requireSession(sessionId);
		List<FamilyMember> familyMembers = familyMemberRepository.findByFamily_Creator_Id(session.getUserId());
		List<Facility> facilities = facilityRepository.findAll();
		return medicalRecordMapper.toFormDto(familyMembers, facilities, null);
	}

	@Override
	@Transactional(readOnly = true)
	public MedicalRecordFormDto getMedicalRecordUpdateForm(String sessionId, Integer recordId) {
		SessionData session = requireSession(sessionId);
		MedicalRecord record = requireMedicalRecord(recordId);
		ensureCanView(session, record);

		List<FamilyMember> familyMembers = familyMemberRepository.findByFamily_Creator_Id(session.getUserId());
		List<Facility> facilities = facilityRepository.findAll();
		return medicalRecordMapper.toFormDto(familyMembers, facilities, record);
	}

	private Facility resolveFacility(Integer facilityId) {
		if (facilityId == null) {
			return null;
		}
		return facilityRepository.findById(facilityId)
				.orElseThrow(() -> new NotFoundException("Facility not found"));
	}

	private SessionData requireSession(String sessionId) {
		return sessionService.getSession(sessionId)
				.orElseThrow(() -> new ForbiddenException("Invalid or expired session"));
	}

	private MedicalRecord requireMedicalRecord(Integer recordId) {
		return medicalRecordRepository.findById(recordId)
				.orElseThrow(() -> new NotFoundException("Medical record not found"));
	}

	private MedicalDocument requireMedicalDocument(Integer documentId) {
		return medicalDocumentRepository.findById(documentId)
				.orElseThrow(() -> new NotFoundException("Medical document not found"));
	}

	private FamilyMember requireFamilyMember(Integer memberId) {
		return familyMemberRepository.findById(memberId)
				.orElseThrow(() -> new NotFoundException("Family member not found"));
	}

	private User requireUser(Integer userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("User not found"));
	}

	private void ensureCanCreateOrUpdate(SessionData session, FamilyMember member, boolean creating) {
		if (isFamily(session)) {
			if (isFamilyCreator(session, member)) {
				return;
			}
			if (isLinkedFamilyMember(session, member)) {
				return;
			}
			throw new ForbiddenException("Family account lacks permission for this member");
		}

		if (isDoctor(session)) {
			if (!isDoctorAssigned(session.getUserId(), member.getId())) {
				throw new ForbiddenException("Doctor is not assigned to this family member");
			}
			return;
		}

		throw new ForbiddenException(
				"User role is not permitted to " + (creating ? "create" : "modify") + " medical records");
	}

	private void ensureCanView(SessionData session, FamilyMember member) {
		if (isFamily(session)) {
			if (isFamilyCreator(session, member) || isLinkedFamilyMember(session, member)) {
				return;
			}
		}

		if (isDoctor(session)) {
			if (isDoctorAssigned(session.getUserId(), member.getId())) {
				return;
			}
		}

		throw new ForbiddenException("User is not allowed to access this family member's records");
	}

	private void ensureCanView(SessionData session, MedicalRecord record) {
		FamilyMember member = record.getFamilyMember();

		if (isFamily(session)) {
			if (isFamilyCreator(session, member) || isLinkedFamilyMember(session, member)) {
				return;
			}
		}

		if (isDoctor(session)) {
			if (isDoctorAssigned(session.getUserId(), member.getId())) {
				return;
			}
		}

		throw new ForbiddenException("User is not allowed to access this medical record");
	}

	private void ensureCanModify(SessionData session, MedicalRecord record) {
		ensureCanView(session, record);

		boolean recordCreatedByDoctor = record.getDoctor() != null;
		if (recordCreatedByDoctor && isFamily(session)) {
			throw new ForbiddenException("Family accounts cannot modify doctor-created records");
		}

		FamilyMember member = record.getFamilyMember();
		if (isFamily(session)) {
			if (isFamilyCreator(session, member) || isLinkedFamilyMember(session, member)) {
				return;
			}
		}

		if (isDoctor(session)) {
			if (isDoctorAssigned(session.getUserId(), member.getId())) {
				return;
			}
		}

		throw new ForbiddenException("User is not allowed to modify this medical record");
	}

	private boolean isFamily(SessionData session) {
		return ROLE_FAMILY.equalsIgnoreCase(session.getRole());
	}

	private boolean isDoctor(SessionData session) {
		return ROLE_DOCTOR.equalsIgnoreCase(session.getRole());
	}

	private boolean isFamilyCreator(SessionData session, FamilyMember member) {
		return member.getFamily() != null
				&& member.getFamily().getCreator() != null
				&& member.getFamily().getCreator().getId().equals(session.getUserId());
	}

	private boolean isLinkedFamilyMember(SessionData session, FamilyMember member) {
		return member.getUser() != null && member.getUser().getId().equals(session.getUserId());
	}

	private boolean isDoctorAssigned(Integer doctorId, Integer memberId) {
		return memberAccessRepository.existsByMemberIdAndDoctorId(memberId, doctorId);
	}
}
