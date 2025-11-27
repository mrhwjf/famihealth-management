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

import com.famihealth.family_health_management.dto.request.health_stats_type.HealthStatsTypeCreateRequest;
import com.famihealth.family_health_management.dto.request.health_stats_type.HealthStatsTypeUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.health_stats_type.HealthStatsTypeDto;
import com.famihealth.family_health_management.service.HealthStatsTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/health-stats-types")
@Validated
@RequiredArgsConstructor
@Tag(name = "Danh mục chỉ số sức khỏe", description = "API quản lý các loại chỉ số sức khỏe được hệ thống hỗ trợ")
public class HealthStatsTypeController {

	private final HealthStatsTypeService service;

	@PostMapping
	@Operation(summary = "Tạo loại chỉ số sức khỏe", description = "Thêm một loại chỉ số sức khỏe mới để người dùng ghi nhận dữ liệu.")
	public ResponseEntity<ApiResponse<HealthStatsTypeDto>> create(
			@Valid @RequestBody HealthStatsTypeCreateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("HealthStatsType created", service.create(req)));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Cập nhật loại chỉ số sức khỏe", description = "Điều chỉnh thông tin mô tả của loại chỉ số sức khỏe dựa trên ID.")
	public ResponseEntity<ApiResponse<HealthStatsTypeDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody HealthStatsTypeUpdateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("HealthStatsType updated", service.updateById(id, req)));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Xóa loại chỉ số sức khỏe", description = "Loại bỏ loại chỉ số sức khỏe không còn được sử dụng trong hệ thống.")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("HealthStatsType deleted", null));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Xem chi tiết loại chỉ số", description = "Tra cứu thông tin chi tiết của một loại chỉ số sức khỏe.")
	public ResponseEntity<ApiResponse<HealthStatsTypeDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	@Operation(summary = "Danh sách loại chỉ số", description = "Phân trang và lọc các loại chỉ số sức khỏe theo tên và thứ tự sắp xếp.")
	public ResponseEntity<ApiResponse<PageResponse<HealthStatsTypeDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@ParameterObject @PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		PageResponse<HealthStatsTypeDto> data = service.getAll(name, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}
}
