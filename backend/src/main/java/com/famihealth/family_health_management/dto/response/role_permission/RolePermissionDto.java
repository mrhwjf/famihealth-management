package com.famihealth.family_health_management.dto.response.role_permission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolePermissionDto {
	private Integer roleId;
	private Integer permissionId;
}
