package com.famihealth.family_health_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllergyDetailDto {
	private Integer id;
	private FamilyMemberSummaryDto familyMember;
	private String allergens;
	private String notes;
}
