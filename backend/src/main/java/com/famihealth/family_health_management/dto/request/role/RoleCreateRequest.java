package com.famihealth.family_health_management.dto.request.role;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Create request for Role master table.
 * Includes a multi-select of permission IDs coming from the admin UI form.
 */
@Data
public class RoleCreateRequest {

	@NotBlank
	@Size(max = 255)
	private String name;

	@Size(max = 2000)
	private String description;

	/**
	 * IDs of permissions to assign to the role. May be empty but never null
	 * from the UI; empty means no permissions. Duplicate IDs are ignored.
	 */
	private Set<Integer> permissionIds;
}
