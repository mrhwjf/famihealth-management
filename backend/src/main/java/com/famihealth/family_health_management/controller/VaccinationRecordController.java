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

import com.famihealth.family_health_management.dto.request.vaccination_record.VaccinationRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.vaccination_record.VaccinationRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.vaccination_record.VaccinationRecordDto;
import com.famihealth.family_health_management.service.VaccinationRecordService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Validated
@Tag(name = "Hồ sơ tiêm chủng", description = "API quản lý lịch sử tiêm chủng của các thành viên gia đình")
public class VaccinationRecordController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final VaccinationRecordService vaccinationRecordService;

	@PostMapping("/family-members/{memberId}/vaccination-records")
	@Operation(summary = "Ghi nhận mũi tiêm", description = "Thêm mới bản ghi tiêm chủng cho thành viên gia đình đã chọn.")
	public ResponseEntity<ApiResponse<VaccinationRecordDto>> createRecord(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer memberId,
			@Valid @RequestBody VaccinationRecordCreateRequest request) {
		VaccinationRecordDto record = vaccinationRecordService.createRecord(sessionId, memberId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Vaccination record created", record));
	}

	@PutMapping("/vaccination-records/{recordId}")
	@Operation(summary = "Cập nhật mũi tiêm", description = "Chỉnh sửa thông tin bản ghi tiêm chủng theo mã bản ghi.")
	public ResponseEntity<ApiResponse<VaccinationRecordDto>> updateRecord(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer recordId,
			@Valid @RequestBody VaccinationRecordUpdateRequest request) {
		VaccinationRecordDto record = vaccinationRecordService.updateRecord(sessionId, recordId, request);
		return ResponseEntity.ok(ApiResponse.success("Vaccination record updated", record));
	}

	@DeleteMapping("/vaccination-records/{recordId}")
	@Operation(summary = "Xóa mũi tiêm", description = "Loại bỏ bản ghi tiêm chủng khỏi hồ sơ thành viên.")
	public ResponseEntity<ApiResponse<Void>> deleteRecord(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer recordId) {
		vaccinationRecordService.deleteRecord(sessionId, recordId);
		return ResponseEntity.ok(ApiResponse.success("Vaccination record deleted", null));
	}

	@GetMapping("/vaccination-records/{recordId}")
	@Operation(summary = "Xem chi tiết mũi tiêm", description = "Tra cứu thông tin chi tiết của một bản ghi tiêm chủng.")
	public ResponseEntity<ApiResponse<VaccinationRecordDto>> getRecordById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer recordId) {
		VaccinationRecordDto record = vaccinationRecordService.getRecordById(sessionId, recordId);
		return ResponseEntity.ok(ApiResponse.success("OK", record));
	}

	@GetMapping("/family-members/{memberId}/vaccination-records")
	@Operation(summary = "Danh sách mũi tiêm của thành viên", description = "Liệt kê tất cả bản ghi tiêm chủng của một thành viên dựa trên mã phiên.")
	public ResponseEntity<ApiResponse<List<VaccinationRecordDto>>> getRecordsByMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer memberId) {
		List<VaccinationRecordDto> records = vaccinationRecordService.getRecordsByMemberId(sessionId, memberId);
		return ResponseEntity.ok(ApiResponse.success("OK", records));
	}
}
