package com.famihealth.family_health_management.dto.response.family_member;

import java.util.List;

import com.famihealth.family_health_management.dto.response.common.IdNamePair;
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
public class FamilyMemberFormDto {
	private FamilyMemberSummaryDto familyMember;
	private List<IdNamePair> relationshipsToCreator;
	private List<BloodType> bloodTypes;
	private List<Gender> genders;
}
