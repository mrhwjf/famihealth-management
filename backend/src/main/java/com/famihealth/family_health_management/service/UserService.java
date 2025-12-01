package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.user.UserCreateRequest;
import com.famihealth.family_health_management.dto.request.user.UserFilterRequest;
import com.famihealth.family_health_management.dto.request.user.UserUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.FilterOptionDto;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;
import com.famihealth.family_health_management.dto.response.user.UserFormDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;

public interface UserService {
	UserDetailDto create(UserCreateRequest dto);

	UserDetailDto getById(Integer id);

	UserDetailDto updateById(Integer id, UserUpdateRequest dto);

	UserFormDto getCreateFormData();

	UserFormDto getEditFormData(Integer id);

	void deleteById(Integer id);

	PageResponse<UserSummaryDto> getAll(UserFilterRequest filter, Pageable pageable);

	FilterOptionDto getFilterOptions();
}
