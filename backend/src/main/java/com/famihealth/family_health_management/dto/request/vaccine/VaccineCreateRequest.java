package com.famihealth.family_health_management.dto.request.vaccine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Create request for Vaccine master table
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VaccineCreateRequest {

	@NotBlank
	@Size(max = 255)
	private String name;
}
