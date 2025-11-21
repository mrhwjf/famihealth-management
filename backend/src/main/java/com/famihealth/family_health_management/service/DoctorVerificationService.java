package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationDetailDto;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationSummaryDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;

public interface DoctorVerificationService {

	// ========================
	// Doctor-only operations
	// ========================

	/**
	 * Submit verification documents for the first time.
	 * Creates a new verification request with status PENDING.
	 */
	DoctorVerificationSummaryDto submitForVerification(Integer doctorId);

	/**
	 * Resubmit after a REJECTED verification attempt.
	 * Creates a new verification row with status PENDING.
	 */
	DoctorVerificationSummaryDto resubmit(Integer doctorId);

	/**
	 * Get all verification attempts of the authenticated doctor.
	 * Useful for showing history in doctor dashboard.
	 */
	PageResponse<DoctorVerificationSummaryDto> getVerificationHistory(Integer doctorId);

	/**
	 * Get the latest verification attempt for a doctor.
	 */
	DoctorVerificationSummaryDto getLatestVerification(Integer doctorId);

	// ========================
	// Admin-only operations
	// ========================

	/**
	 * Approve a doctor's verification.
	 * Updates the latest PENDING attempt, sets status = APPROVED, sets admin and
	 * reviewed_at.
	 */
	void approveDoctor(Integer doctorId, Integer adminId, String remarks);

	/**
	 * Reject a doctor's verification.
	 * Updates the latest PENDING attempt, sets status = REJECTED, sets admin and
	 * reviewed_at.
	 */
	void rejectDoctor(Integer doctorId, Integer adminId, String remarks);

	/**
	 * List all doctors with PENDING verification requests.
	 */
	PageResponse<UserSummaryDto> getPendingVerification(Pageable pageable);

	/**
	 * List all doctors with REJECTED verification requests.
	 */
	PageResponse<UserSummaryDto> getRejectedVerification(Pageable pageable);

	/**
	 * Get verification attempts for a specific doctor (admin view).
	 */
	PageResponse<DoctorVerificationSummaryDto> getDoctorVerificationHistory(Integer doctorId);

	// ========================
	// Shared / helper methods
	// ========================

	/**
	 * Check if a doctor is currently verified.
	 */
	boolean isVerified(Integer doctorId);

	/**
	 * Check if a doctor has any PENDING verification.
	 */
	boolean hasPendingVerification(Integer doctorId);

	/**
	 * Check if a doctor can resubmit (i.e., last attempt was REJECTED).
	 */
	boolean canResubmit(Integer doctorId);

	/**
	 * View details of a specific verification attempt.
	 */
	DoctorVerificationDetailDto getVerificationDetails(Integer verificationId);
}
