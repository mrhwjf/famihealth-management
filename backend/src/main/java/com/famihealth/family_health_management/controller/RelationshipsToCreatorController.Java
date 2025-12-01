package com.famihealth.family_health_management.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.famihealth.family_health_management.dto.request.relationships_to_creator.RelationshipsToCreatorCreateRequest;
import com.famihealth.family_health_management.dto.request.relationships_to_creator.RelationshipsToCreatorUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.relationships_to_creator.RelationshipsToCreatorDto;
import com.famihealth.family_health_management.service.RelationshipsToCreatorService;


@RestController
@RequestMapping("/api/v1/relationships-to-creator")
@Validated
@RequiredArgsConstructor
public class RelationshipsToCreatorController {
	private final RelationshipsToCreatorService service;

	@PostMapping
	public ResponseEntity<ApiResponse<RelationshipsToCreatorDto>> create(
			@Valid @RequestBody RelationshipsToCreatorCreateRequest req) {

		return ResponseEntity.ok(ApiResponse.success("Relationship to creator created", service.create(req)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<RelationshipsToCreatorDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody RelationshipsToCreatorUpdateRequest req) {

		return ResponseEntity.ok(ApiResponse.success("Relationship to creator updated", service.updateById(id, req)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("Relationship to creator deleted", null));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<RelationshipsToCreatorDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<RelationshipsToCreatorDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {
				
		return ResponseEntity.ok(
				ApiResponse.success("OK", service.getAll(name, pageable)));
	}
}
