package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.permission.PermissionCreateRequest;
import com.famihealth.family_health_management.dto.request.permission.PermissionUpdateRequest;
import com.famihealth.family_health_management.dto.response.permission.PermissionDto;
import com.famihealth.family_health_management.model.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

	PermissionDto toDto(Permission entity);

	// Create/Update mappings from request DTOs
	@Mapping(target = "id", ignore = true)
	Permission toEntity(PermissionCreateRequest req);

	@Mapping(target = "id", ignore = true)
	void updateEntityFromDto(PermissionUpdateRequest req, @MappingTarget Permission entity);
}
