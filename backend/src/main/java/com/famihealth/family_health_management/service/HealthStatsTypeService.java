package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.health_stats_type.HealthStatsTypeCreateRequest;
import com.famihealth.family_health_management.dto.request.health_stats_type.HealthStatsTypeUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.health_stats_type.HealthStatsTypeDto;

public interface HealthStatsTypeService {
	HealthStatsTypeDto create(HealthStatsTypeCreateRequest req);

	HealthStatsTypeDto updateById(Integer id, HealthStatsTypeUpdateRequest req);

	void deleteById(Integer id);

	HealthStatsTypeDto getById(Integer id);

	PageResponse<HealthStatsTypeDto> getByName(String name, Pageable pageable);

	PageResponse<HealthStatsTypeDto> getAll(String name, Pageable pageable);
}
