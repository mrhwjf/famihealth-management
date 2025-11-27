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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/roles")
@Validated
@RequiredArgsConstructor
@Tag(name = "Vai trò hệ thống", description = "API quản trị danh sách vai trò và quyền truy cập")
public class RoleController {

	private final RoleService roleService;

	@PostMapping
	@Operation(summary = "Tạo vai trò", description = "Thêm mới một vai trò hệ thống với tập quyền tương ứng.")
	public ResponseEntity<ApiResponse<RoleDto>> create(@Valid @RequestBody RoleCreateRequest req) {
		RoleDto dto = roleService.create(req);
		return ResponseEntity.ok(ApiResponse.success("Role created", dto));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Cập nhật vai trò", description = "Điều chỉnh tên và quyền của vai trò dựa trên ID.")
	public ResponseEntity<ApiResponse<RoleDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody RoleUpdateRequest req) {
		RoleDto dto = roleService.updateById(id, req);
		return ResponseEntity.ok(ApiResponse.success("Role updated", dto));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Xóa vai trò", description = "Loại bỏ vai trò khỏi hệ thống và thu hồi quyền liên quan.")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		roleService.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("Role deleted", null));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Xem chi tiết vai trò", description = "Lấy thông tin chi tiết của một vai trò theo mã định danh.")
	public ResponseEntity<ApiResponse<RoleDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", roleService.getById(id)));
	}

	@GetMapping
	@Operation(summary = "Danh sách vai trò", description = "Phân trang và lọc danh sách vai trò theo tên để quản trị.")
	public ResponseEntity<ApiResponse<PageResponse<RoleDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {

		PageResponse<RoleDto> data = roleService.getAll(name, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}
}
