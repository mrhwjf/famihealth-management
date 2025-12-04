package com.famihealth.family_health_management.service;

import java.util.List;

import com.famihealth.family_health_management.dto.request.allergy.AllergyCreateRequest;
import com.famihealth.family_health_management.dto.request.allergy.AllergyUpdateRequest;
import com.famihealth.family_health_management.dto.response.allergy.AllergyDto;

public interface AllergyService {

	AllergyDto createAllergy(String sessionId, Integer memberId, AllergyCreateRequest request);

	AllergyDto updateAllergy(String sessionId, Integer allergyId, AllergyUpdateRequest request);

	void deleteAllergy(String sessionId, Integer allergyId);

	AllergyDto getAllergyById(String sessionId, Integer allergyId);

	List<AllergyDto> getAllergiesByMemberId(String sessionId, Integer memberId);

	List<AllergyDto> getAllergiesByFamilyId(String sessionId, Integer familyId);
}
