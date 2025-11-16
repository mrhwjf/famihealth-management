package com.famihealth.family_health_management.controller;

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

@RestController
@RequestMapping("/api/v1/health-stats-types")
@Validated
@RequiredArgsConstructor
public class HealthStatsTypeController {

	private final HealthStatsTypeService service;

	@PostMapping
	public ResponseEntity<ApiResponse<HealthStatsTypeDto>> create(
			@Valid @RequestBody HealthStatsTypeCreateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("HealthStatsType created", service.create(req)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<HealthStatsTypeDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody HealthStatsTypeUpdateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("HealthStatsType updated", service.updateById(id, req)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("HealthStatsType deleted", null));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<HealthStatsTypeDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<HealthStatsTypeDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		PageResponse<HealthStatsTypeDto> data = service.getAll(name, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}
}
