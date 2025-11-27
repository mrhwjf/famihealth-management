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

import com.famihealth.family_health_management.dto.request.facility.FacilityCreateRequest;
import com.famihealth.family_health_management.dto.request.facility.FacilityUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.faclitiy.FacilityDto;
import com.famihealth.family_health_management.service.FacilityService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/facilities")
@Validated
@RequiredArgsConstructor
@Tag(name = "Quản lý cơ sở y tế", description = "API quản lý danh sách cơ sở y tế hợp tác với hệ thống")
public class FacilityController {

	private final FacilityService service;

	@PostMapping
	@Operation(summary = "Tạo cơ sở y tế", description = "Thêm mới thông tin một cơ sở y tế bao gồm tên và địa chỉ liên hệ.")
	public ResponseEntity<ApiResponse<FacilityDto>> create(@Valid @RequestBody FacilityCreateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("Facility created", service.create(req)));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Cập nhật cơ sở y tế", description = "Điều chỉnh thông tin của một cơ sở y tế dựa trên mã định danh.")
	public ResponseEntity<ApiResponse<FacilityDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody FacilityUpdateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("Facility updated", service.updateById(id, req)));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Xóa cơ sở y tế", description = "Gỡ bỏ cơ sở y tế khỏi hệ thống quản trị.")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("Facility deleted", null));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Xem chi tiết cơ sở y tế", description = "Tra cứu thông tin của một cơ sở y tế cụ thể theo ID.")
	public ResponseEntity<ApiResponse<FacilityDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	@Operation(summary = "Tìm kiếm cơ sở y tế", description = "Phân trang và lọc danh sách cơ sở y tế theo tên và các tiêu chí sắp xếp.")
	public ResponseEntity<ApiResponse<PageResponse<FacilityDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@ParameterObject @PageableDefault(page = 0, size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
		PageResponse<FacilityDto> data = service.getAll(name, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}
}
