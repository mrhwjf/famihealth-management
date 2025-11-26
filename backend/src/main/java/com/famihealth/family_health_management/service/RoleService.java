package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.role.RoleCreateRequest;
import com.famihealth.family_health_management.dto.request.role.RoleUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.role.RoleDto;

public interface RoleService {
	RoleDto create(RoleCreateRequest req);

	RoleDto updateById(Integer id, RoleUpdateRequest req);

	void deleteById(Integer id);

	RoleDto getById(Integer id);

	PageResponse<RoleDto> getByName(String name, Pageable pageable);

	PageResponse<RoleDto> getAll(String name, Pageable pageable);
}
