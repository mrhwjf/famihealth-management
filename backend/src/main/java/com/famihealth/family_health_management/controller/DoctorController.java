package com.famihealth.family_health_management.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationDetailDto;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationSummaryDto;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;
import com.famihealth.family_health_management.service.DoctorService;
import com.famihealth.family_health_management.service.DoctorVerificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/doctors")
@Validated
@RequiredArgsConstructor
public class DoctorController {
	private final DoctorService doctorService;
	private final DoctorVerificationService verificationService;

	@PostMapping
	public ResponseEntity<ApiResponse<UserDetailDto>> create(@Valid @RequestBody DoctorCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.success("Doctor created", doctorService.create(request)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<UserDetailDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody DoctorUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.success("Doctor updated", doctorService.update(request, id)));
	}

	/**
	 * Submit verification documents (first time)
	 */
	@PostMapping("/{doctorId}/verification/submit")
	public ResponseEntity<ApiResponse<DoctorVerificationSummaryDto>> submitVerification(
			@PathVariable Integer doctorId) {
		DoctorVerificationSummaryDto dto = verificationService.submitForVerification(doctorId);
		return ResponseEntity.ok(ApiResponse.success("Submitted successfully", dto));
	}

	/**
	 * Resubmit after rejection
	 */
	@PostMapping("/{doctorId}/verification/resubmit")
	public ResponseEntity<ApiResponse<DoctorVerificationSummaryDto>> resubmitVerification(
			@PathVariable Integer doctorId) {
		DoctorVerificationSummaryDto dto = verificationService.resubmit(doctorId);
		return ResponseEntity.ok(ApiResponse.success("Resubmitted successfully", dto));
	}

	/**
	 * Get all verification attempts (history)
	 */
	@GetMapping("/{doctorId}/verification/history")
	public ResponseEntity<ApiResponse<PageResponse<DoctorVerificationSummaryDto>>> getVerificationHistory(
			@PathVariable Integer doctorId,
			@PageableDefault(size = 10, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable) {
		PageResponse<DoctorVerificationSummaryDto> page = verificationService.getVerificationHistory(doctorId);
		return ResponseEntity.ok(ApiResponse.success("History fetched", page));
	}

	/**
	 * Get latest verification attempt
	 */
	@GetMapping("/{doctorId}/verification/latest")
	public ResponseEntity<ApiResponse<DoctorVerificationSummaryDto>> getLatestVerification(
			@PathVariable Integer doctorId) {
		DoctorVerificationSummaryDto dto = verificationService.getLatestVerification(doctorId);
		return ResponseEntity.ok(ApiResponse.success("Latest verification fetched", dto));
	}

	/**
	 * View details of a specific verification attempt
	 */
	@GetMapping("/verification/{verificationId}")
	public ResponseEntity<ApiResponse<DoctorVerificationDetailDto>> getVerificationDetails(
			@PathVariable Integer verificationId) {
		DoctorVerificationDetailDto dto = verificationService.getVerificationDetails(verificationId);
		return ResponseEntity.ok(ApiResponse.success("Verification details fetched", dto));
	}
}
