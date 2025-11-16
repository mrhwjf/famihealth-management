package com.famihealth.family_health_management.dto.request.drug;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Update request for Drug master table
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrugUpdateRequest {

	@NotBlank
	@Size(max = 255)
	private String name;

	@Size(max = 2000)
	private String description;
}
