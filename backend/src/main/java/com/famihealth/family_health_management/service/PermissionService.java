package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.permission.PermissionCreateRequest;
import com.famihealth.family_health_management.dto.request.permission.PermissionUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.permission.PermissionDto;

public interface PermissionService {
	PermissionDto create(PermissionCreateRequest req);

	PermissionDto updateById(Integer id, PermissionUpdateRequest req);

	void deleteById(Integer id);

	PermissionDto getById(Integer id);

	PageResponse<PermissionDto> getByName(String name, Pageable pageable);

	PageResponse<PermissionDto> getAll(String name, Pageable pageable);
}
