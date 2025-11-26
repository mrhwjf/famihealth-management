package com.famihealth.family_health_management.service.helper;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.model.Family;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.repository.FamilyAccessRepository;
import com.famihealth.family_health_management.repository.FamilyMemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FamilyMemberAccessValidator {

	private static final String ROLE_FAMILY = "FAMILY";

	private final FamilyMemberRepository familyMemberRepository;
	private final FamilyAccessRepository familyAccessRepository;

	@Transactional(readOnly = true)
	public FamilyMember validateMemberAccess(Integer memberId, Integer requesterId, String role) {
		if (requesterId == null) {
			throw new ForbiddenException("Invalid session");
		}
		if (role == null || !ROLE_FAMILY.equalsIgnoreCase(role)) {
			throw new ForbiddenException("Only family accounts can perform this action");
		}

		FamilyMember member = familyMemberRepository.findById(memberId)
				.orElseThrow(() -> new NotFoundException("Family member not found"));

		Family family = member.getFamily();
		if (family == null || family.getId() == null) {
			throw new BadRequestException("Family member is not linked to a valid family");
		}

		boolean hasAccess = familyAccessRepository.existsByFamilyIdAndUserId(family.getId(), requesterId);
		if (!hasAccess) {
			throw new ForbiddenException("User does not belong to the target family");
		}

		Integer creatorId = family.getCreator() != null ? family.getCreator().getId() : null;
		if (creatorId != null && creatorId.equals(requesterId)) {
			return member;
		}

		if (member.getUser() != null && member.getUser().getId() != null
				&& member.getUser().getId().equals(requesterId)) {
			return member;
		}

		throw new ForbiddenException("Access denied for the specified family member");
	}
}
