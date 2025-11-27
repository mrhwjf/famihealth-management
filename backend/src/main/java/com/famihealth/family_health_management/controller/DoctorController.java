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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/doctors")
@Validated
@RequiredArgsConstructor
@Tag(name = "Quản lý bác sĩ", description = "API quản lý hồ sơ bác sĩ và quy trình thẩm định hành nghề")
public class DoctorController {
	private final DoctorService doctorService;
	private final DoctorVerificationService verificationService;

	@PostMapping
	@Operation(summary = "Tạo hồ sơ bác sĩ", description = "Khởi tạo tài khoản và thông tin hành nghề cho một bác sĩ mới.")
	public ResponseEntity<ApiResponse<UserDetailDto>> create(@Valid @RequestBody DoctorCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.success("Doctor created", doctorService.create(request)));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Cập nhật hồ sơ bác sĩ", description = "Điều chỉnh thông tin hồ sơ của bác sĩ dựa trên mã định danh.")
	public ResponseEntity<ApiResponse<UserDetailDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody DoctorUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.success("Doctor updated", doctorService.update(request, id)));
	}

	/**
	 * Submit verification documents (first time)
	 */
	@PostMapping("/{doctorId}/verification/submit")
	@Operation(summary = "Gửi hồ sơ thẩm định lần đầu", description = "Bác sĩ gửi bộ hồ sơ thẩm định hành nghề lần đầu tiên để được xét duyệt.")
	public ResponseEntity<ApiResponse<DoctorVerificationSummaryDto>> submitVerification(
			@PathVariable Integer doctorId) {
		DoctorVerificationSummaryDto dto = verificationService.submitForVerification(doctorId);
		return ResponseEntity.ok(ApiResponse.success("Submitted successfully", dto));
	}

	/**
	 * Resubmit after rejection
	 */
	@PostMapping("/{doctorId}/verification/resubmit")
	@Operation(summary = "Gửi lại hồ sơ sau từ chối", description = "Bác sĩ gửi lại hồ sơ thẩm định sau khi đã bị từ chối và cập nhật thông tin cần thiết.")
	public ResponseEntity<ApiResponse<DoctorVerificationSummaryDto>> resubmitVerification(
			@PathVariable Integer doctorId) {
		DoctorVerificationSummaryDto dto = verificationService.resubmit(doctorId);
		return ResponseEntity.ok(ApiResponse.success("Resubmitted successfully", dto));
	}

	/**
	 * Get all verification attempts (history)
	 */
	@GetMapping("/{doctorId}/verification/history")
	@Operation(summary = "Xem lịch sử thẩm định", description = "Truy xuất toàn bộ các lần gửi thẩm định của một bác sĩ với thông tin phân trang.")
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
	@Operation(summary = "Xem lần thẩm định gần nhất", description = "Lấy thông tin lần thẩm định gần nhất của bác sĩ để theo dõi trạng thái mới nhất.")
	public ResponseEntity<ApiResponse<DoctorVerificationSummaryDto>> getLatestVerification(
			@PathVariable Integer doctorId) {
		DoctorVerificationSummaryDto dto = verificationService.getLatestVerification(doctorId);
		return ResponseEntity.ok(ApiResponse.success("Latest verification fetched", dto));
	}

	/**
	 * View details of a specific verification attempt
	 */
	@GetMapping("/verification/{verificationId}")
	@Operation(summary = "Xem chi tiết thẩm định", description = "Xem chi tiết đầy đủ của một lần thẩm định cụ thể theo mã thẩm định.")
	public ResponseEntity<ApiResponse<DoctorVerificationDetailDto>> getVerificationDetails(
			@PathVariable Integer verificationId) {
		DoctorVerificationDetailDto dto = verificationService.getVerificationDetails(verificationId);
		return ResponseEntity.ok(ApiResponse.success("Verification details fetched", dto));
	}
}
