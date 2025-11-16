package com.famihealth.family_health_management.controller;

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

import com.famihealth.family_health_management.dto.request.vaccine.VaccineCreateRequest;
import com.famihealth.family_health_management.dto.request.vaccine.VaccineUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.vaccine.VaccineDto;
import com.famihealth.family_health_management.service.VaccineService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/vaccines")
@Validated
@RequiredArgsConstructor
public class VaccineController {

	private final VaccineService service;

	@PostMapping
	public ResponseEntity<ApiResponse<VaccineDto>> create(@Valid @RequestBody VaccineCreateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("Vaccine created", service.create(req)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<VaccineDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody VaccineUpdateRequest req) {
		return ResponseEntity.ok(ApiResponse.success("Vaccine updated", service.updateById(id, req)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("Vaccine deleted", null));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<VaccineDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<VaccineDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@PageableDefault(size = 10, sort = "id") Pageable pageable) {
		PageResponse<VaccineDto> data = service.getAll(name, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}
}
