package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.family.FamilyCreateRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyUpdateRequest;
import com.famihealth.family_health_management.dto.response.family.FamilyDto;
import com.famihealth.family_health_management.model.Family;

@Mapper(componentModel = "spring")
public interface FamilyMapper {

	@Mapping(target = "memberCount", expression = "java(entity.getMembers() != null ? entity.getMembers().size() : 0)")
	@Mapping(target = "creatorName", source = "creator.name")
	FamilyDto toDto(Family entity);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "creator", ignore = true)
	@Mapping(target = "members", ignore = true)
	Family toEntity(FamilyCreateRequest req);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "creator", ignore = true)
	@Mapping(target = "members", ignore = true)
	void updateEntityFromDto(FamilyUpdateRequest dto, @MappingTarget Family entity);
}
