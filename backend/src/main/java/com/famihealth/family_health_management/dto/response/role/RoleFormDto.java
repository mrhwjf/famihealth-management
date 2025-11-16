package com.famihealth.family_health_management.dto.response.role;

import java.util.Set;

import com.famihealth.family_health_management.dto.response.permission.PermissionDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleFormDto {
	private Integer id;
	private String name;
	private String description;
	private Set<PermissionDto> permissions;
	private Set<Integer> assignedPermissionIds;
}
