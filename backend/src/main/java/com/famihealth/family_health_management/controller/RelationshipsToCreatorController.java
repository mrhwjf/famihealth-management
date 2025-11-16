package com.famihealth.family_health_management.controller;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.relationships_to_creator.RelationshipsToCreatorDto;
import com.famihealth.family_health_management.service.RelationshipsToCreatorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/relationships-to-creator")
@RequiredArgsConstructor
public class RelationshipsToCreatorController {

	private final RelationshipsToCreatorService service;

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<RelationshipsToCreatorDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<RelationshipsToCreatorDto>>> getAll(
			@RequestParam(required = false) String relationshipName,
			@PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		PageResponse<RelationshipsToCreatorDto> data = service.getAll(relationshipName, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", data));
	}

}
