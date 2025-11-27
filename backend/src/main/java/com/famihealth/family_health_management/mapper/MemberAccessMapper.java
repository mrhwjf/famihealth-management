package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.famihealth.family_health_management.dto.response.member_access.MemberAccessDto;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.model.User;

@Mapper(componentModel = "spring")
public interface MemberAccessMapper {
	@Mapping(target = "memberId", source = "member.id")
	@Mapping(target = "memberName", source = "member.name")
	@Mapping(target = "doctorId", source = "doctor.id")
	@Mapping(target = "doctorName", source = "doctor.name")
	MemberAccessDto toDto(FamilyMember member, User doctor);
}
