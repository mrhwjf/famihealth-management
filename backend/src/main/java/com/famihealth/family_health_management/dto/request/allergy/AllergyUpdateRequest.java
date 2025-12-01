package com.famihealth.family_health_management.dto.request.allergy;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllergyUpdateRequest {
	@Size(max = 255)
	private String allergens;

	@Size(max = 1000)
	private String notes;
}
