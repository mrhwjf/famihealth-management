package com.famihealth.family_health_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberCreateRequest;
import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.IdNamePair;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberDetailDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberFormDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberSummaryDto;
import com.famihealth.family_health_management.enums.BloodType;
import com.famihealth.family_health_management.enums.Gender;
import com.famihealth.family_health_management.model.FamilyMember;

@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface FamilyMemberMapper {

	@Mapping(target = "relationshipToCreator", source = "relationshipToCreator.relationshipName")
	FamilyMemberDetailDto toDetailDto(FamilyMember entity);

	@Mapping(target = "relationshipToCreator", source = "relationshipToCreator.relationshipName")
	FamilyMemberSummaryDto toSummaryDto(FamilyMember entity);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "relationshipToCreator", ignore = true)
	@Mapping(target = "family", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "memberAccesses", ignore = true)
	void updateEntityFromDto(FamilyMemberUpdateRequest req, @MappingTarget FamilyMember entity);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "relationshipToCreator", ignore = true)
	@Mapping(target = "family", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "memberAccesses", ignore = true)
	FamilyMember toEntity(FamilyMemberCreateRequest req);

	FamilyMemberFormDto toFormDto(FamilyMember familyMember, List<IdNamePair> relationshipsToCreator,
			List<BloodType> bloodTypes, List<Gender> genders);
}
