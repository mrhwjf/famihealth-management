package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.role.RoleCreateRequest;
import com.famihealth.family_health_management.dto.request.role.RoleUpdateRequest;
import com.famihealth.family_health_management.dto.response.role.RoleDto;
import com.famihealth.family_health_management.model.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {

	RoleDto toDto(Role entity);

	default String toName(Role role) {
		return role != null ? role.getName() : null;
	}

	// Create/Update mappings from request DTOs
	@Mapping(target = "id", ignore = true)
	Role toEntity(RoleCreateRequest req);

	@Mapping(target = "id", ignore = true)
	void updateEntityFromDto(RoleUpdateRequest req, @MappingTarget Role entity);
}
