package com.famihealth.family_health_management.dto.response.allergy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllergySummaryDto {
	private Integer id;
	private String familyMemberName;
	private String allergens;
	private String notes;
}
