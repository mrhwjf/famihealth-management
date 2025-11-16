package com.famihealth.family_health_management.dto.request.permission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Update request for Permission master table
 */
@Data
public class PermissionUpdateRequest {

	@NotBlank
	@Size(max = 255)
	private String name;

	@Size(max = 2000)
	private String description;
}
