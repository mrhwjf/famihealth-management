package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.health_stat.HealthStatCreateRequest;
import com.famihealth.family_health_management.dto.request.health_stat.HealthStatFilterRequest;
import com.famihealth.family_health_management.dto.request.health_stat.HealthStatUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatDetailDto;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatDto;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatSummaryDto;

public interface HealthStatService {

	HealthStatDto create(String sessionId, Integer familyId, Integer memberId, HealthStatCreateRequest req);

	HealthStatDto updateById(String sessionId, Integer familyId, Integer memberId, Integer healthStatId,
			HealthStatUpdateRequest req);

	void deleteById(String sessionId, Integer familyId, Integer memberId, Integer healthStatId);

	HealthStatDetailDto getById(String sessionId, Integer familyId, Integer memberId, Integer healthStatId);

	PageResponse<HealthStatSummaryDto> getByMember(String sessionId, Integer familyId, Integer memberId,
			HealthStatFilterRequest filter, Pageable pageable);
}
