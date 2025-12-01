package com.famihealth.family_health_management.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.vaccination_record.VaccinationRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.vaccination_record.VaccinationRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.dto.response.vaccination_record.VaccinationRecordDto;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.mapper.VaccinationRecordMapper;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.model.VaccinationRecord;
import com.famihealth.family_health_management.model.Vaccine;
import com.famihealth.family_health_management.repository.VaccinationRecordRepository;
import com.famihealth.family_health_management.repository.VaccineRepository;
import com.famihealth.family_health_management.service.SessionService;
import com.famihealth.family_health_management.service.VaccinationRecordService;
import com.famihealth.family_health_management.service.helper.FamilyMemberAccessValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class VaccinationRecordServiceImpl implements VaccinationRecordService {

	private final SessionService sessionService;
	private final VaccinationRecordRepository vaccinationRecordRepository;
	private final VaccineRepository vaccineRepository;
	private final VaccinationRecordMapper vaccinationRecordMapper;
	private final FamilyMemberAccessValidator accessValidator;

	@Override
	public VaccinationRecordDto createRecord(String sessionId, Integer memberId,
			VaccinationRecordCreateRequest request) {
		SessionData session = requireSession(sessionId);
		FamilyMember member = accessValidator.validateMemberAccess(memberId, session.getUserId(), session.getRole());
		Vaccine vaccine = requireVaccine(request.getVaccineId());
		validateDates(request.getAdministeredDate(), request.getNextDueDate());

		VaccinationRecord entity = vaccinationRecordMapper.toEntity(request);
		entity.setFamilyMember(member);
		entity.setVaccine(vaccine);

		VaccinationRecord saved = vaccinationRecordRepository.save(entity);
		return vaccinationRecordMapper.toDto(saved);
	}

	@Override
	public VaccinationRecordDto updateRecord(String sessionId, Integer recordId,
			VaccinationRecordUpdateRequest request) {
		SessionData session = requireSession(sessionId);
		VaccinationRecord record = requireRecord(recordId);
		FamilyMember member = requireRecordMember(record);
		accessValidator.validateMemberAccess(member.getId(), session.getUserId(), session.getRole());

		if (request.getVaccineId() == null && request.getAdministeredDate() == null
				&& request.getNextDueDate() == null) {
			throw new BadRequestException("At least one field must be provided for update");
		}

		LocalDate administeredDate = request.getAdministeredDate() != null ? request.getAdministeredDate()
				: record.getAdministeredDate();
		LocalDate nextDueDate = request.getNextDueDate() != null ? request.getNextDueDate() : record.getNextDueDate();
		validateDates(administeredDate, nextDueDate);

		if (request.getVaccineId() != null) {
			Vaccine vaccine = requireVaccine(request.getVaccineId());
			record.setVaccine(vaccine);
		}

		vaccinationRecordMapper.updateEntityFromDto(request, record);
		VaccinationRecord saved = vaccinationRecordRepository.save(record);
		return vaccinationRecordMapper.toDto(saved);
	}

	@Override
	public void deleteRecord(String sessionId, Integer recordId) {
		SessionData session = requireSession(sessionId);
		VaccinationRecord record = requireRecord(recordId);
		FamilyMember member = requireRecordMember(record);
		accessValidator.validateMemberAccess(member.getId(), session.getUserId(), session.getRole());
		vaccinationRecordRepository.delete(record);
	}

	@Override
	@Transactional(readOnly = true)
	public VaccinationRecordDto getRecordById(String sessionId, Integer recordId) {
		SessionData session = requireSession(sessionId);
		VaccinationRecord record = requireRecord(recordId);
		FamilyMember member = requireRecordMember(record);
		accessValidator.validateMemberAccess(member.getId(), session.getUserId(), session.getRole());
		return vaccinationRecordMapper.toDto(record);
	}

	@Override
	@Transactional(readOnly = true)
	public List<VaccinationRecordDto> getRecordsByMemberId(String sessionId, Integer memberId) {
		SessionData session = requireSession(sessionId);
		accessValidator.validateMemberAccess(memberId, session.getUserId(), session.getRole());
		return vaccinationRecordRepository.findByFamilyMember_Id(memberId).stream()
				.map(vaccinationRecordMapper::toDto)
				.toList();
	}

	private SessionData requireSession(String sessionId) {
		Integer requesterId = sessionService.getUserId(sessionId)
				.orElseThrow(() -> new ForbiddenException("Invalid session"));
		SessionData session = sessionService.getSession(sessionId)
				.orElseThrow(() -> new ForbiddenException("Invalid session"));
		if (!requesterId.equals(session.getUserId())) {
			throw new ForbiddenException("Invalid session");
		}
		return session;
	}

	private VaccinationRecord requireRecord(Integer recordId) {
		return vaccinationRecordRepository.findById(recordId)
				.orElseThrow(() -> new NotFoundException("Vaccination record not found"));
	}

	private FamilyMember requireRecordMember(VaccinationRecord record) {
		FamilyMember member = record.getFamilyMember();
		if (member == null || member.getId() == null) {
			throw new BadRequestException("Vaccination record is not linked to a valid family member");
		}
		return member;
	}

	private Vaccine requireVaccine(Integer vaccineId) {
		return vaccineRepository.findById(vaccineId)
				.orElseThrow(() -> new NotFoundException("Vaccine not found"));
	}

	private void validateDates(LocalDate administeredDate, LocalDate nextDueDate) {
		if (administeredDate != null && nextDueDate != null && nextDueDate.isBefore(administeredDate)) {
			throw new BadRequestException("Next due date cannot be before the administered date");
		}
	}
}
