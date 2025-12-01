package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.famihealth.family_health_management.dto.response.health_stats.HealthStatDetailDto;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatDto;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatSummaryDto;
import com.famihealth.family_health_management.model.HealthStat;

@Mapper(componentModel = "spring", uses = { FamilyMemberMapper.class, HealthStatsTypeMapper.class })
public interface HealthStatMapper {

	@Mapping(target = "familyMemberId", source = "familyMember.id")
	@Mapping(target = "statsTypeId", source = "statsType.id")
	HealthStatDto toDto(HealthStat entity);

	@Mapping(target = "familyMemberName", source = "familyMember.name")
	@Mapping(target = "statsTypeName", source = "statsType.name")
	HealthStatSummaryDto toSummaryDto(HealthStat entity);

	@Mapping(target = "familyMember", source = "familyMember")
	@Mapping(target = "statsType", source = "statsType")
	HealthStatDetailDto toDetailDto(HealthStat entity);
}
