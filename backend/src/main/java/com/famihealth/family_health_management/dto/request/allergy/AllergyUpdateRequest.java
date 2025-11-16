package com.famihealth.family_health_management.dto.request.allergy;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing Allergy.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllergyUpdateRequest {
	@NotBlank
	private String allergens;
	@Nullable
	private String notes;
}
