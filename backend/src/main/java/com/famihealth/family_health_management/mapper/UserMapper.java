package com.famihealth.family_health_management.mapper;

import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.user.UserCreateRequest;
import com.famihealth.family_health_management.dto.request.user.UserUpdateRequest;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;
import com.famihealth.family_health_management.dto.response.user.UserFormDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.model.User;

@Mapper(componentModel = "spring", uses = { RoleMapper.class, DoctorProfileMapper.class })
public interface UserMapper {

	UserDetailDto toDetailDto(User entity);

	UserSummaryDto toSummaryDto(User entity);

	@Mapping(target = "userDetails", source = "entity")
	UserFormDto toFormDto(User entity, Set<Role> roles); // keep entity as parameter

	@Mapping(target = "passwordHash", ignore = true)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	@Mapping(target = "locked", ignore = true)
	@Mapping(target = "role", ignore = true)
	@Mapping(target = "doctorProfile", ignore = true)
	@Mapping(target = "familyAccesses", ignore = true)
	User toEntity(UserCreateRequest req);

	@Mapping(target = "passwordHash", ignore = true)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	@Mapping(target = "locked", ignore = true)
	@Mapping(target = "role", ignore = true)
	@Mapping(target = "doctorProfile", ignore = true)
	@Mapping(target = "familyAccesses", ignore = true)
	void updateEntityFromDto(UserUpdateRequest dto, @MappingTarget User entity);
}
