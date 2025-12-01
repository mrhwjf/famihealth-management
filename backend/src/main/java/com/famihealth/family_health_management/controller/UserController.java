package com.famihealth.family_health_management.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.user.UserCreateRequest;
import com.famihealth.family_health_management.dto.request.user.UserFilterRequest;
import com.famihealth.family_health_management.dto.request.user.UserUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.FilterOptionDto;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;
import com.famihealth.family_health_management.dto.response.user.UserFormDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;
import com.famihealth.family_health_management.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService service;

	@PostMapping
	public ResponseEntity<ApiResponse<UserDetailDto>> create(@Valid @RequestBody UserCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.success("User created", service.create(request)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<UserDetailDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody UserUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.success("User updated", service.updateById(id, request)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("User deleted", null));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<UserDetailDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<UserSummaryDto>>> getAll(
			@Valid @ModelAttribute @ParameterObject UserFilterRequest filter,
			@ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {

		PageResponse<UserSummaryDto> response = service.getAll(filter, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", response));
	}

	@GetMapping("/form-data")
	public ResponseEntity<ApiResponse<UserFormDto>> getCreateFormData() {
		UserFormDto formData = service.getCreateFormData();
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("/{id}/form-data")
	public ResponseEntity<ApiResponse<UserFormDto>> getEditFormData(@PathVariable Integer id) {
		UserFormDto formData = service.getEditFormData(id);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("/filter-options")
	public ResponseEntity<ApiResponse<FilterOptionDto>> getFilterOptions() {
		FilterOptionDto filterOptions = service.getFilterOptions();
		return ResponseEntity.ok(ApiResponse.success("OK", filterOptions));
	}
}