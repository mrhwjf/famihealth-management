package com.famihealth.family_health_management.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordDetailDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordFormDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordSummaryDto;
import com.famihealth.family_health_management.service.MedicalRecordService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/medical-records")
@RequiredArgsConstructor
@Validated
@Tag(name = "Hồ sơ y tế", description = "API quản lý hồ sơ khám chữa bệnh và biểu mẫu liên quan")
public class MedicalRecordController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final MedicalRecordService medicalRecordService;

	@GetMapping("/{id}")
	@Operation(summary = "Xem chi tiết hồ sơ y tế", description = "Tra cứu thông tin chi tiết của hồ sơ y tế dựa trên mã định danh.")
	public ResponseEntity<ApiResponse<MedicalRecordDetailDto>> getById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		MedicalRecordDetailDto record = medicalRecordService.getRecordById(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("OK", record));
	}

	@PostMapping
	@Operation(summary = "Tạo hồ sơ y tế", description = "Khởi tạo hồ sơ y tế mới cho thành viên dựa trên thông tin khám chữa bệnh.")
	public ResponseEntity<ApiResponse<MedicalRecordDetailDto>> create(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @RequestBody MedicalRecordCreateRequest request) {
		MedicalRecordDetailDto record = medicalRecordService.createRecord(sessionId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Medical record created", record));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Cập nhật hồ sơ y tế", description = "Chỉnh sửa thông tin của hồ sơ y tế đã tồn tại.")
	public ResponseEntity<ApiResponse<MedicalRecordDetailDto>> update(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id,
			@Valid @RequestBody MedicalRecordUpdateRequest request) {
		MedicalRecordDetailDto record = medicalRecordService.updateRecord(sessionId, id, request);
		return ResponseEntity.ok(ApiResponse.success("Medical record updated", record));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Xóa hồ sơ y tế", description = "Loại bỏ hồ sơ y tế khỏi hệ thống và dừng chia sẻ dữ liệu.")
	public ResponseEntity<ApiResponse<Void>> delete(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		medicalRecordService.deleteRecord(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("Medical record deleted", null));
	}

	@GetMapping("/form-data")
	@Operation(summary = "Lấy dữ liệu tạo hồ sơ", description = "Cung cấp danh sách lựa chọn cần thiết để tạo hồ sơ y tế mới.")
	public ResponseEntity<ApiResponse<MedicalRecordFormDto>> getFormData(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		MedicalRecordFormDto formData = medicalRecordService.getMedicalRecordCreateForm(sessionId);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("/{id}/form-data")
	@Operation(summary = "Lấy dữ liệu chỉnh sửa hồ sơ", description = "Cung cấp thông tin tham chiếu để chỉnh sửa hồ sơ y tế hiện hữu.")
	public ResponseEntity<ApiResponse<MedicalRecordFormDto>> getUpdateFormData(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		MedicalRecordFormDto formData = medicalRecordService.getMedicalRecordUpdateForm(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("family-member/{familyMemberId}")
	@Operation(summary = "Danh sách hồ sơ của thành viên", description = "Phân trang danh sách hồ sơ y tế của một thành viên gia đình dựa trên quyền phiên.")
	public ResponseEntity<ApiResponse<PageResponse<MedicalRecordSummaryDto>>> getByFamilyMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyMemberId,
			@PageableDefault(size = 10, page = 0) Pageable pageable) {
		PageResponse<MedicalRecordSummaryDto> records = medicalRecordService
				.getRecordsByFamilyMember(sessionId, familyMemberId, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", records));
	}
}
