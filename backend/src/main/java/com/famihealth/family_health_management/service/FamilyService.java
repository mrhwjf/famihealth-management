package com.famihealth.family_health_management.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.family.FamilyCreateRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyFilterRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyUpdateRequest;
import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberCreateRequest;
import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.family.FamilyDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberSummaryDto;

public interface FamilyService {
	// ========================
	// Family CRUD
	// ========================

	/**
	 * Create a new family.
	 * After that, a new entry of invite code will be created for this family.
	 */
	FamilyDto create(String sessionId, FamilyCreateRequest req);

	FamilyDto updateById(String sessionId, Integer id, FamilyUpdateRequest req);

	FamilyDto getById(String sessionId, Integer id);

	void deleteById(String sessionId, Integer id);

	/**
	 * Get all families with filtering and pagination.
	 * This will depends on the requester's ID, as it will only return families that
	 * the requester has access to.
	 */
	PageResponse<FamilyDto> getAll(String sessionId, FamilyFilterRequest filter, Pageable pageable);

	// ========================
	// Family Member CRUD
	// ========================

	FamilyMemberSummaryDto createMember(String sessionId, Integer familyId, FamilyMemberCreateRequest req);

	void deleteMemberById(String sessionId, Integer familyId, Integer memberId);

	FamilyMemberSummaryDto getMemberById(String sessionId, Integer familyId, Integer memberId);

	FamilyMemberSummaryDto updateMemberById(String sessionId, Integer familyId, Integer memberId,
			FamilyMemberUpdateRequest req);

	List<FamilyMemberSummaryDto> getAllMembersInFamily(String sessionId, Integer familyId);

	// =========================
	// Family Access Control
	// =========================

	void addUserToFamily(String sessionId, Integer familyId, Integer userId);

	void removeUserFromFamily(String sessionId, Integer familyId, Integer userId);

	void linkUserToMember(String sessionId, Integer familyId, Integer memberId, Integer userId);

	void unlinkUserFromMember(String sessionId, Integer familyId, Integer memberId, Integer userId);

	void linkDoctorToMember(String sessionId, Integer familyId, Integer memberId, Integer doctorId);

	void unlinkDoctorFromMember(String sessionId, Integer familyId, Integer memberId, Integer doctorId);
}
