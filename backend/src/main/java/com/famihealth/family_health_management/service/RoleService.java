package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.role.RoleCreateRequest;
import com.famihealth.family_health_management.dto.request.role.RoleUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.role.RoleDetailDto;
import com.famihealth.family_health_management.dto.response.role.RoleFormDto;
import com.famihealth.family_health_management.dto.response.role.RoleSummaryDto;

public interface RoleService {
	RoleDetailDto create(RoleCreateRequest req);

	RoleDetailDto updateById(Integer id, RoleUpdateRequest req);

	void deleteById(Integer id);

	RoleDetailDto getById(Integer id);

	PageResponse<RoleSummaryDto> getByName(String name, Pageable pageable);

	PageResponse<RoleSummaryDto> getAll(String name, Pageable pageable);

	RoleFormDto getEditFormData(Integer id);

	RoleFormDto getCreateFormData();
}
