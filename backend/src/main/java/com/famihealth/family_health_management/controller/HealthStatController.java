package com.famihealth.family_health_management.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.health_stat.HealthStatCreateRequest;
import com.famihealth.family_health_management.dto.request.health_stat.HealthStatFilterRequest;
import com.famihealth.family_health_management.dto.request.health_stat.HealthStatUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatDetailDto;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatDto;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatSummaryDto;
import com.famihealth.family_health_management.service.HealthStatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/families/{familyId}/members/{memberId}/health-stats")
@Validated
@RequiredArgsConstructor
@Tag(name = "Chỉ số sức khỏe", description = "API ghi nhận và theo dõi các chỉ số sức khỏe của thành viên")
public class HealthStatController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final HealthStatService healthStatService;

	@PostMapping
	@Operation(summary = "Ghi nhận chỉ số sức khỏe", description = "Tạo mới bản ghi chỉ số sức khỏe cho một thành viên trong gia đình.")
	public ResponseEntity<ApiResponse<HealthStatDto>> create(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody HealthStatCreateRequest request) {
		HealthStatDto result = healthStatService.create(sessionId, familyId, memberId, request);
		return ResponseEntity.ok(ApiResponse.success("Health stat recorded", result));
	}

	@PutMapping("/{healthStatId}")
	@Operation(summary = "Cập nhật chỉ số sức khỏe", description = "Chỉnh sửa dữ liệu của một chỉ số sức khỏe đã ghi nhận.")
	public ResponseEntity<ApiResponse<HealthStatDto>> update(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@PathVariable Integer healthStatId,
			@Valid @RequestBody HealthStatUpdateRequest request) {
		HealthStatDto result = healthStatService.updateById(sessionId, familyId, memberId, healthStatId, request);
		return ResponseEntity.ok(ApiResponse.success("Health stat updated", result));
	}

	@DeleteMapping("/{healthStatId}")
	@Operation(summary = "Xóa chỉ số sức khỏe", description = "Loại bỏ bản ghi chỉ số sức khỏe khỏi hồ sơ thành viên.")
	public ResponseEntity<ApiResponse<Void>> delete(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@PathVariable Integer healthStatId) {
		healthStatService.deleteById(sessionId, familyId, memberId, healthStatId);
		return ResponseEntity.ok(ApiResponse.success("Health stat deleted", null));
	}

	@GetMapping("/{healthStatId}")
	@Operation(summary = "Xem chi tiết chỉ số sức khỏe", description = "Truy xuất thông tin chi tiết của một chỉ số sức khỏe theo ID.")
	public ResponseEntity<ApiResponse<HealthStatDetailDto>> getById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@PathVariable Integer healthStatId) {
		HealthStatDetailDto result = healthStatService.getById(sessionId, familyId, memberId, healthStatId);
		return ResponseEntity.ok(ApiResponse.success("OK", result));
	}

	@GetMapping
	@Operation(summary = "Danh sách chỉ số sức khỏe", description = "Lọc và phân trang danh sách chỉ số sức khỏe của thành viên theo bộ lọc được cung cấp.")
	public ResponseEntity<ApiResponse<PageResponse<HealthStatSummaryDto>>> getAll(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@ParameterObject @ModelAttribute HealthStatFilterRequest filter,
			@ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		PageResponse<HealthStatSummaryDto> page = healthStatService.getByMember(sessionId, familyId, memberId, filter,
				pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", page));
	}
}
