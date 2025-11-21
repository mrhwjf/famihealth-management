package com.famihealth.family_health_management.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationSummaryDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;
import com.famihealth.family_health_management.service.DoctorVerificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/doctor-verifications")
@RequiredArgsConstructor
@Validated
public class AdminDoctorVerificationController {

    private final DoctorVerificationService verificationService;

    // --------------------------
    // Admin-only endpoints
    // --------------------------

    /**
     * Approve a doctor's verification
     */
    @PostMapping("/{doctorId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveDoctor(
            @PathVariable Integer doctorId,
            @RequestParam Integer adminId,
            @RequestParam(required = false) String remarks) {
        verificationService.approveDoctor(doctorId, adminId, remarks);
        return ResponseEntity.ok(ApiResponse.success("Doctor approved", null));
    }

    /**
     * Reject a doctor's verification
     */
    @PostMapping("/{doctorId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectDoctor(
            @PathVariable Integer doctorId,
            @RequestParam Integer adminId,
            @RequestParam String remarks) {
        verificationService.rejectDoctor(doctorId, adminId, remarks);
        return ResponseEntity.ok(ApiResponse.success("Doctor rejected", null));
    }

    /**
     * Get all doctors with PENDING verification
     */
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryDto>>> getPendingVerification(
            @PageableDefault(size = 10, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<UserSummaryDto> page = verificationService.getPendingVerification(pageable);
        return ResponseEntity.ok(ApiResponse.success("Pending verifications fetched", page));
    }

    /**
     * Get all doctors with REJECTED verification
     */
    @GetMapping("/rejected")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryDto>>> getRejectedVerification(
            @PageableDefault(size = 10, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<UserSummaryDto> page = verificationService.getRejectedVerification(pageable);
        return ResponseEntity.ok(ApiResponse.success("Rejected verifications fetched", page));
    }

    /**
     * Get verification history for a specific doctor (admin view)
     */
    @GetMapping("/{doctorId}/history")
    public ResponseEntity<ApiResponse<PageResponse<DoctorVerificationSummaryDto>>> getDoctorVerificationHistory(
            @PathVariable Integer doctorId,
            @PageableDefault(size = 10, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<DoctorVerificationSummaryDto> page = verificationService.getDoctorVerificationHistory(doctorId);
        return ResponseEntity.ok(ApiResponse.success("Doctor verification history fetched", page));
    }
}
