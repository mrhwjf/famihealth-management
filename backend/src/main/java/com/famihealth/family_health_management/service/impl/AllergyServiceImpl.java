package com.famihealth.family_health_management.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.allergy.AllergyCreateRequest;
import com.famihealth.family_health_management.dto.request.allergy.AllergyUpdateRequest;
import com.famihealth.family_health_management.dto.response.allergy.AllergyDto;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.mapper.AllergyMapper;
import com.famihealth.family_health_management.model.Allergy;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.repository.AllergyRepository;
import com.famihealth.family_health_management.service.AllergyService;
import com.famihealth.family_health_management.service.SessionService;
import com.famihealth.family_health_management.service.helper.FamilyMemberAccessValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AllergyServiceImpl implements AllergyService {

	private final SessionService sessionService;
	private final AllergyRepository allergyRepository;
	private final AllergyMapper allergyMapper;
	private final FamilyMemberAccessValidator accessValidator;

	@Override
	public AllergyDto createAllergy(String sessionId, Integer memberId, AllergyCreateRequest request) {
		SessionData session = requireSession(sessionId);
		FamilyMember member = accessValidator.validateMemberAccess(memberId, session.getUserId(), session.getRole());

		Allergy allergy = allergyMapper.toEntity(request);
		allergy.setFamilyMember(member);

		Allergy saved = allergyRepository.save(allergy);
		return allergyMapper.toDto(saved);
	}

	@Override
	public AllergyDto updateAllergy(String sessionId, Integer allergyId, AllergyUpdateRequest request) {
		SessionData session = requireSession(sessionId);
		Allergy allergy = requireAllergy(allergyId);
		FamilyMember member = requireAllergyMember(allergy);
		accessValidator.validateMemberAccess(member.getId(), session.getUserId(), session.getRole());

		if (request.getAllergens() == null && request.getNotes() == null) {
			throw new BadRequestException("At least one field must be provided for update");
		}

		allergyMapper.updateEntityFromDto(request, allergy);
		Allergy saved = allergyRepository.save(allergy);
		return allergyMapper.toDto(saved);
	}

	@Override
	public void deleteAllergy(String sessionId, Integer allergyId) {
		SessionData session = requireSession(sessionId);
		Allergy allergy = requireAllergy(allergyId);
		FamilyMember member = requireAllergyMember(allergy);
		accessValidator.validateMemberAccess(member.getId(), session.getUserId(), session.getRole());

		allergyRepository.delete(allergy);
	}

	@Override
	@Transactional(readOnly = true)
	public AllergyDto getAllergyById(String sessionId, Integer allergyId) {
		SessionData session = requireSession(sessionId);
		Allergy allergy = requireAllergy(allergyId);
		FamilyMember member = requireAllergyMember(allergy);
		accessValidator.validateMemberAccess(member.getId(), session.getUserId(), session.getRole());
		return allergyMapper.toDto(allergy);
	}

	@Override
	@Transactional(readOnly = true)
	public List<AllergyDto> getAllergiesByMemberId(String sessionId, Integer memberId) {
		SessionData session = requireSession(sessionId);
		accessValidator.validateMemberAccess(memberId, session.getUserId(), session.getRole());
		return allergyRepository.findByFamilyMember_Id(memberId).stream()
				.map(allergyMapper::toDto)
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

	private Allergy requireAllergy(Integer allergyId) {
		return allergyRepository.findById(allergyId)
				.orElseThrow(() -> new NotFoundException("Allergy not found"));
	}

	private FamilyMember requireAllergyMember(Allergy allergy) {
		FamilyMember member = allergy.getFamilyMember();
		if (member == null || member.getId() == null) {
			throw new BadRequestException("Allergy is not linked to a valid family member");
		}
		return member;
	}
}
