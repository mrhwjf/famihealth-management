package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.vaccine.VaccineCreateRequest;
import com.famihealth.family_health_management.dto.request.vaccine.VaccineUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.vaccine.VaccineDto;

public interface VaccineService {
	VaccineDto create(VaccineCreateRequest req);

	VaccineDto updateById(Integer id, VaccineUpdateRequest req);

	void deleteById(Integer id);

	VaccineDto getById(Integer id);

	PageResponse<VaccineDto> getByName(String name, Pageable pageable);

	PageResponse<VaccineDto> getAll(String name, Pageable pageable);
}
