package com.famihealth.family_health_management.mapper;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.role.RoleCreateRequest;
import com.famihealth.family_health_management.dto.request.role.RoleUpdateRequest;
import com.famihealth.family_health_management.dto.response.role.RoleDetailDto;
import com.famihealth.family_health_management.dto.response.role.RoleFormDto;
import com.famihealth.family_health_management.dto.response.role.RoleSummaryDto;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.model.Permission;

@Mapper(componentModel = "spring", uses = { PermissionMapper.class })
public interface RoleMapper {

	RoleDetailDto toDetailsDto(Role entity);

	RoleSummaryDto toSummaryDto(Role entity);

	// Map Role + all available permissions to form DTO
	@Mapping(target = "assignedPermissionIds", expression = "java(role != null ? extractPermissionIds(role.getPermissions()) : java.util.Collections.emptySet())")
	@Mapping(target = "permissions", expression = "java(allPermissions.stream().map(permissionMapper::toDto).collect(java.util.stream.Collectors.toSet()))")
	RoleFormDto toFormDto(Role role, Set<Permission> allPermissions);

	default Set<Integer> extractPermissionIds(Set<Permission> permissions) {
		if (permissions == null)
			return Collections.emptySet();
		return permissions.stream()
				.map(Permission::getId)
				.collect(Collectors.toSet());
	}

	// Create/Update mappings from request DTOs
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "permissions", ignore = true)
	Role toEntity(RoleCreateRequest req);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "permissions", ignore = true)
	void updateEntityFromDto(RoleUpdateRequest req, @MappingTarget Role entity);
}
