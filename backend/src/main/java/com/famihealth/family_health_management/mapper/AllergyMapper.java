package com.famihealth.family_health_management.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.famihealth.family_health_management.dto.request.allergy.AllergyCreateRequest;
import com.famihealth.family_health_management.dto.request.allergy.AllergyUpdateRequest;
import com.famihealth.family_health_management.dto.response.allergy.AllergyDto;
import com.famihealth.family_health_management.model.Allergy;

@Mapper(componentModel = "spring")
public interface AllergyMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "familyMember", ignore = true)
	Allergy toEntity(AllergyCreateRequest request);

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "familyMember", ignore = true)
	void updateEntityFromDto(AllergyUpdateRequest request, @MappingTarget Allergy entity);

	@Mapping(target = "familyMemberId", source = "familyMember.id")
	@Mapping(target = "familyMemberName", source = "familyMember.name")
	AllergyDto toDto(Allergy entity);
}
