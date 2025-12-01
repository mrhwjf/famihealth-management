package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.facility.FacilityCreateRequest;
import com.famihealth.family_health_management.dto.request.facility.FacilityUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.faclitiy.FacilityDto;

public interface FacilityService {
	FacilityDto create(FacilityCreateRequest req);

	FacilityDto updateById(Integer id, FacilityUpdateRequest req);

	void deleteById(Integer id);

	FacilityDto getById(Integer id);

	PageResponse<FacilityDto> getByName(String name, Pageable pageable);

	PageResponse<FacilityDto> getAll(String name, Pageable pageable);
}
