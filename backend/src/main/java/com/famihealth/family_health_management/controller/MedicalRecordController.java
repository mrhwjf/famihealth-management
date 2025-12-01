package com.famihealth.family_health_management.controller;

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
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordDetailDto;
import com.famihealth.family_health_management.service.MedicalRecordService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/medical-records")
@RequiredArgsConstructor
@Validated
public class MedicalRecordController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final MedicalRecordService medicalRecordService;

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<MedicalRecordDetailDto>> getById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		MedicalRecordDetailDto record = medicalRecordService.getRecordById(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("OK", record));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<MedicalRecordDetailDto>> create(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @RequestBody MedicalRecordCreateRequest request) {
		MedicalRecordDetailDto record = medicalRecordService.createRecord(sessionId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Medical record created", record));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<MedicalRecordDetailDto>> update(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id,
			@Valid @RequestBody MedicalRecordUpdateRequest request) {
		MedicalRecordDetailDto record = medicalRecordService.updateRecord(sessionId, id, request);
		return ResponseEntity.ok(ApiResponse.success("Medical record updated", record));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		medicalRecordService.deleteRecord(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("Medical record deleted", null));
	}
}
