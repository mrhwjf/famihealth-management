package com.famihealth.family_health_management.service;

import com.famihealth.family_health_management.dto.response.family_invite_code.FamilyInviteCodeDto;

public interface FamilyInviteCodeService {

	FamilyInviteCodeDto getInviteCodeByFamilyId(String sessionId, Integer familyId);

	FamilyInviteCodeDto regenerateInviteCodeByFamilyId(String sessionId, Integer familyId);

	void createInviteCodeForFamily(Integer familyId);

	void deactivateInviteCodeByFamilyId(String sessionId, Integer familyId);

	void activateInviteCodeByFamilyId(String sessionId, Integer familyId);

	boolean validateInviteCode(Integer familyId, String code);
}
