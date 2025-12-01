package com.famihealth.family_health_management.dto.request.family_member;

import com.famihealth.family_health_management.enums.BloodType;
import com.famihealth.family_health_management.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberFilterRequest {
	private String field;
	private String keyword;
	private Gender gender;
	private BloodType bloodType;
	private Integer familyId;

}