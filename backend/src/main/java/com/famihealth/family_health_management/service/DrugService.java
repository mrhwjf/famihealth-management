package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.drug.DrugCreateRequest;
import com.famihealth.family_health_management.dto.request.drug.DrugUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.drug.DrugDto;

public interface DrugService {
	DrugDto create(DrugCreateRequest req);

	DrugDto updateById(Integer id, DrugUpdateRequest req);

	void deleteById(Integer id);

	DrugDto getById(Integer id);

	PageResponse<DrugDto> getByName(String name, Pageable pageable);

	PageResponse<DrugDto> getAll(String name, Pageable pageable);
}
