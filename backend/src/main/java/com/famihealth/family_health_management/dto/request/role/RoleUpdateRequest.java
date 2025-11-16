package com.famihealth.family_health_management.dto.request.role;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Update request for Role master table.
 * permissionIds replaces existing permissions if provided (non-null).
 */
@Data
public class RoleUpdateRequest {

	@NotBlank
	@Size(max = 255)
	private String name;

	@Size(max = 2000)
	private String description;

	/**
	 * Optional list of permission IDs. If null, permissions remain unchanged.
	 * If empty set provided, permissions will be cleared.
	 */
	private Set<Integer> permissionIds;
}
