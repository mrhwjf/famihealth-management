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

import com.famihealth.family_health_management.dto.request.drug.DrugCreateRequest;
import com.famihealth.family_health_management.dto.request.drug.DrugUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.drug.DrugDto;
import com.famihealth.family_health_management.service.DrugService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/drugs")
@Validated
@RequiredArgsConstructor
public class DrugController {

	private final DrugService service;

	@PostMapping
	public ResponseEntity<ApiResponse<DrugDto>> create(@Valid @RequestBody DrugCreateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("Drug created", service.create(req)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<DrugDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody DrugUpdateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("Drug updated", service.updateById(id, req)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("Drug deleted", null));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<DrugDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<DrugDto>>> getAll(
			@RequestParam(required = false) String name,
			@ParameterObject @PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		PageResponse<DrugDto> data = service.getAll(name, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}

}
