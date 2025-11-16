package com.famihealth.family_health_management.dto.request.facility;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Update request for Facility master table
 */
@Data
public class FacilityUpdateRequest {

	@NotBlank
	@Size(max = 255)
	private String name;
}
