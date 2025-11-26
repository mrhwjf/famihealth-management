package com.famihealth.family_health_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.allergy.AllergyCreateRequest;
import com.famihealth.family_health_management.dto.request.allergy.AllergyUpdateRequest;
import com.famihealth.family_health_management.dto.response.allergy.AllergyDto;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.service.AllergyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Validated
public class AllergyController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final AllergyService allergyService;

	@PostMapping("/family-members/{memberId}/allergies")
	public ResponseEntity<ApiResponse<AllergyDto>> createAllergy(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer memberId,
			@Valid @RequestBody AllergyCreateRequest request) {
		AllergyDto allergy = allergyService.createAllergy(sessionId, memberId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Allergy created", allergy));
	}

	@PutMapping("/allergies/{allergyId}")
	public ResponseEntity<ApiResponse<AllergyDto>> updateAllergy(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer allergyId,
			@Valid @RequestBody AllergyUpdateRequest request) {
		AllergyDto allergy = allergyService.updateAllergy(sessionId, allergyId, request);
		return ResponseEntity.ok(ApiResponse.success("Allergy updated", allergy));
	}

	@DeleteMapping("/allergies/{allergyId}")
	public ResponseEntity<ApiResponse<Void>> deleteAllergy(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer allergyId) {
		allergyService.deleteAllergy(sessionId, allergyId);
		return ResponseEntity.ok(ApiResponse.success("Allergy deleted", null));
	}

	@GetMapping("/allergies/{allergyId}")
	public ResponseEntity<ApiResponse<AllergyDto>> getAllergyById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer allergyId) {
		AllergyDto allergy = allergyService.getAllergyById(sessionId, allergyId);
		return ResponseEntity.ok(ApiResponse.success("OK", allergy));
	}

	@GetMapping("/family-members/{memberId}/allergies")
	public ResponseEntity<ApiResponse<List<AllergyDto>>> getAllergiesByMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer memberId) {
		List<AllergyDto> allergies = allergyService.getAllergiesByMemberId(sessionId, memberId);
		return ResponseEntity.ok(ApiResponse.success("OK", allergies));
	}
}
