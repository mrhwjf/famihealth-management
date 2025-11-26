package com.famihealth.family_health_management.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
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

import com.famihealth.family_health_management.dto.request.role.RoleCreateRequest;
import com.famihealth.family_health_management.dto.request.role.RoleUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.role.RoleDto;
import com.famihealth.family_health_management.service.RoleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/roles")
@Validated
@RequiredArgsConstructor
public class RoleController {

	private final RoleService roleService;

	@PostMapping
	public ResponseEntity<ApiResponse<RoleDto>> create(@Valid @RequestBody RoleCreateRequest req) {
		RoleDto dto = roleService.create(req);
		return ResponseEntity.ok(ApiResponse.success("Role created", dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<RoleDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody RoleUpdateRequest req) {
		RoleDto dto = roleService.updateById(id, req);
		return ResponseEntity.ok(ApiResponse.success("Role updated", dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		roleService.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("Role deleted", null));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<RoleDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", roleService.getById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<RoleDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {

		PageResponse<RoleDto> data = roleService.getAll(name, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}
}
