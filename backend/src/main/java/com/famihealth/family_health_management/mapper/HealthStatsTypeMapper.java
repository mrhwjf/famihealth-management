package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.health_stats_type.HealthStatsTypeCreateRequest;
import com.famihealth.family_health_management.dto.request.health_stats_type.HealthStatsTypeUpdateRequest;
import com.famihealth.family_health_management.dto.response.health_stats_type.HealthStatsTypeDto;
import com.famihealth.family_health_management.model.HealthStatsType;

@Mapper(componentModel = "spring")
public interface HealthStatsTypeMapper {

	HealthStatsTypeDto toDto(HealthStatsType entity);

	@Mapping(target = "id", ignore = true)
	HealthStatsType toEntity(HealthStatsTypeCreateRequest req);

	@Mapping(target = "id", ignore = true)
	void updateEntityFromDto(HealthStatsTypeUpdateRequest req, @MappingTarget HealthStatsType entity);
}
