package com.famihealth.family_health_management.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.dto.response.family_invite_code.FamilyInviteCodeDto;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.mapper.FamilyInviteCodeMapper;
import com.famihealth.family_health_management.model.Family;
import com.famihealth.family_health_management.model.FamilyInviteCode;
import com.famihealth.family_health_management.repository.FamilyInviteCodeRepository;
import com.famihealth.family_health_management.repository.FamilyRepository;
import com.famihealth.family_health_management.service.FamilyInviteCodeService;
import com.famihealth.family_health_management.service.SessionService;
import com.famihealth.family_health_management.utils.InviteCodeGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FamilyInviteCodeServiceImpl implements FamilyInviteCodeService {

	private static final String ROLE_FAMILY = "FAMILY";

	private final FamilyInviteCodeRepository familyInviteCodeRepository;
	private final FamilyRepository familyRepository;
	private final SessionService sessionService;
	private final FamilyInviteCodeMapper familyInviteCodeMapper;

	@Override
	@Transactional(readOnly = true)
	public FamilyInviteCodeDto getInviteCodeByFamilyId(String sessionId, Integer familyId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);
		FamilyInviteCode inviteCode = familyInviteCodeRepository.findByFamily_Id(familyId)
				.orElseThrow(() -> new NotFoundException("Invite code not found"));
		return familyInviteCodeMapper.toDto(inviteCode);
	}

	@Override
	public FamilyInviteCodeDto regenerateInviteCodeByFamilyId(String sessionId, Integer familyId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);
		FamilyInviteCode inviteCode = familyInviteCodeRepository.findByFamily_Id(familyId)
				.orElseThrow(() -> new NotFoundException("Invite code not found"));
		inviteCode.setCode(generateInviteCode());
		inviteCode.setActive(Boolean.TRUE);
		inviteCode.setUpdatedAt(LocalDateTime.now());
		FamilyInviteCode saved = familyInviteCodeRepository.save(inviteCode);
		return familyInviteCodeMapper.toDto(saved);
	}

	@Override
	public void createInviteCodeForFamily(Integer familyId) {
		if (familyInviteCodeRepository.existsByFamily_Id(familyId)) {
			return;
		}
		Family family = requireFamily(familyId);
		FamilyInviteCode inviteCode = new FamilyInviteCode();
		inviteCode.setFamily(family);
		inviteCode.setCode(generateInviteCode());
		inviteCode.setActive(Boolean.TRUE);
		inviteCode.setUpdatedAt(LocalDateTime.now());
		familyInviteCodeRepository.save(inviteCode);
	}

	@Override
	public void deactivateInviteCodeByFamilyId(String sessionId, Integer familyId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);
		FamilyInviteCode inviteCode = familyInviteCodeRepository.findByFamily_Id(familyId)
				.orElseThrow(() -> new NotFoundException("Invite code not found"));
		inviteCode.setActive(Boolean.FALSE);
		inviteCode.setUpdatedAt(LocalDateTime.now());
		familyInviteCodeRepository.save(inviteCode);
	}

	@Override
	public void activateInviteCodeByFamilyId(String sessionId, Integer familyId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);
		FamilyInviteCode inviteCode = familyInviteCodeRepository.findByFamily_Id(familyId)
				.orElseThrow(() -> new NotFoundException("Invite code not found"));
		inviteCode.setActive(Boolean.TRUE);
		inviteCode.setUpdatedAt(LocalDateTime.now());
		familyInviteCodeRepository.save(inviteCode);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean validateInviteCode(Integer familyId, String code) {
		if (code == null || code.isBlank()) {
			return false;
		}
		return familyInviteCodeRepository.findByFamily_IdAndActiveTrue(familyId)
				.filter(invite -> code.equals(invite.getCode()))
				.isPresent();
	}

	private SessionData requireSession(String sessionId) {
		return sessionService.getSession(sessionId)
				.orElseThrow(() -> new ForbiddenException("Invalid or expired session"));
	}

	private Family requireFamily(Integer familyId) {
		return familyRepository.findById(familyId)
				.orElseThrow(() -> new NotFoundException("Family not found"));
	}

	private void ensureCreator(SessionData session, Family family) {
		String role = session.getRole();
		if (role == null || !ROLE_FAMILY.equalsIgnoreCase(role)
				|| !family.getCreator().getId().equals(session.getUserId())) {
			throw new ForbiddenException("Only the family creator may manage invite codes");
		}
	}

	private String generateInviteCode() {
		String code;
		do {
			code = InviteCodeGenerator.generateCode();
		} while (familyInviteCodeRepository.findByCode(code).isPresent());
		return code;
	}
}
