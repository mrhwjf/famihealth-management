package com.famihealth.family_health_management.dto.request.vaccine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Update request for Vaccine master table
 */
@Data
public class VaccineUpdateRequest {

	@NotBlank
	@Size(max = 255)
	private String name;
}
