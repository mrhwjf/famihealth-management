package com.famihealth.family_health_management.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.permission.PermissionCreateRequest;
import com.famihealth.family_health_management.dto.request.permission.PermissionUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.permission.PermissionDto;
import com.famihealth.family_health_management.service.PermissionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/permissions")
@Validated
@RequiredArgsConstructor
public class PermissionController {

	private final PermissionService service;

	@PostMapping
	public ResponseEntity<ApiResponse<PermissionDto>> create(@Valid @RequestBody PermissionCreateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("Permission created", service.create(req)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<PermissionDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody PermissionUpdateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("Permission updated", service.updateById(id, req)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("Permission deleted", null));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<PermissionDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<PermissionDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@ParameterObject @PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		PageResponse<PermissionDto> data = service.getAll(name, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}
}
