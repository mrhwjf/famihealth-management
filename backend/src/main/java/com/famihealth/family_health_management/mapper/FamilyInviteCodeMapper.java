package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.famihealth.family_health_management.dto.response.family_invite_code.FamilyInviteCodeDto;
import com.famihealth.family_health_management.model.FamilyInviteCode;

@Mapper(componentModel = "spring")
public interface FamilyInviteCodeMapper {

	@Mapping(target = "familyId", source = "family.id")
	FamilyInviteCodeDto toDto(FamilyInviteCode entity);
}
