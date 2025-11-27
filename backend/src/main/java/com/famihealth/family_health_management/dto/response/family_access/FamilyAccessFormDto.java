package com.famihealth.family_health_management.dto.response.family_access;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.famihealth.family_health_management.dto.response.common.IdNamePair;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyAccessFormDto {

	private List<IdNamePair> familyMembers;
	private List<IdNamePair> doctors;
}
