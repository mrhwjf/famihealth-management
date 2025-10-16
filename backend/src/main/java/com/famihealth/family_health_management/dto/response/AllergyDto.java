package com.famihealth.family_health_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllergyDto {
	private Integer id;
	private Integer familyMemberId;
	private String allergens;
	private String notes;
}
