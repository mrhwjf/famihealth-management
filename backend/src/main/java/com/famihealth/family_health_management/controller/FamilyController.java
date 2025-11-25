package com.famihealth.family_health_management.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
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

import com.famihealth.family_health_management.dto.request.family.FamilyCreateRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyFilterRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.family.FamilyDto;
import com.famihealth.family_health_management.service.FamilyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/families")
@RequiredArgsConstructor
@Validated
public class FamilyController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final FamilyService familyService;

	@PostMapping
	public ResponseEntity<ApiResponse<FamilyDto>> create(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @RequestBody FamilyCreateRequest request) {
		FamilyDto result = familyService.create(sessionId, request);
		return ResponseEntity.ok(ApiResponse.success("Family created", result));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<FamilyDto>> update(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id,
			@Valid @RequestBody FamilyUpdateRequest request) {
		FamilyDto result = familyService.updateById(sessionId, id, request);
		return ResponseEntity.ok(ApiResponse.success("Family updated", result));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<FamilyDto>> getById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		FamilyDto result = familyService.getById(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("OK", result));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		familyService.deleteById(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("Family deleted", null));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<FamilyDto>>> getAll(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @ModelAttribute @ParameterObject FamilyFilterRequest filter,
			@ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {
		PageResponse<FamilyDto> page = familyService.getAll(sessionId, filter, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", page));
	}

	@PostMapping("/{familyId}/access/users/{userId}")
	public ResponseEntity<ApiResponse<Void>> addUser(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer userId) {
		familyService.addUserToFamily(sessionId, familyId, userId);
		return ResponseEntity.ok(ApiResponse.success("User added to family", null));
	}

	@DeleteMapping("/{familyId}/access/users/{userId}")
	public ResponseEntity<ApiResponse<Void>> removeUser(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer userId) {
		familyService.removeUserFromFamily(sessionId, familyId, userId);
		return ResponseEntity.ok(ApiResponse.success("User removed from family", null));
	}
}
