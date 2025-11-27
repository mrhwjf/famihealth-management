package com.famihealth.family_health_management.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.famihealth.family_health_management.dto.response.common.FileUploadResponseDto;
import com.famihealth.family_health_management.dto.response.medical_document.MedicalDocumentDto;
import com.famihealth.family_health_management.service.CloudinaryService;

import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Tag(name = "Tải lên tệp", description = "API tải lên ảnh đại diện, chứng chỉ bác sĩ và tài liệu y tế")
public class FileUploadController {

	private final CloudinaryService cloudinaryService;

	@PostMapping(value = "/profile/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Tải ảnh đại diện người dùng", description = "Tải lên và cập nhật ảnh đại diện cho tài khoản người dùng hiện tại.")
	public FileUploadResponseDto uploadProfilePicture(
			@RequestHeader("X-Session-Id") String sessionId,
			@RequestParam("file") MultipartFile file) {
		return cloudinaryService.uploadUserProfilePicture(sessionId, file);
	}

	@PostMapping(value = "/family-members/{id}/profile/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Tải ảnh đại diện thành viên", description = "Tải lên ảnh đại diện cho một thành viên trong gia đình dựa trên mã thành viên.")
	public FileUploadResponseDto uploadFamilyMemberProfilePicture(
			@RequestHeader("X-Session-Id") String sessionId,
			@PathVariable("id") Integer memberId,
			@RequestParam("file") MultipartFile file) {
		return cloudinaryService.uploadFamilyMemberProfilePicture(sessionId, memberId, file);
	}

	@PostMapping(value = "/doctor-profiles/{doctorId}/certificate/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Tải chứng chỉ hành nghề bác sĩ", description = "Tải lên chứng chỉ hành nghề phục vụ thẩm định hồ sơ bác sĩ.")
	public FileUploadResponseDto uploadDoctorCertificate(
			@RequestHeader("X-Session-Id") String sessionId,
			@PathVariable("doctorId") Integer doctorId,
			@RequestParam("file") MultipartFile file) {
		return cloudinaryService.uploadDoctorCertificate(sessionId, doctorId, file);
	}

	@PostMapping(value = "/medical-documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Tải tài liệu y tế", description = "Tải lên tài liệu y tế gắn với hồ sơ khám chữa bệnh của thành viên.")
	public MedicalDocumentDto uploadMedicalDocument(
			@RequestHeader("X-Session-Id") String sessionId,
			@RequestParam("medicalRecordId") Integer medicalRecordId,
			@RequestParam("file") MultipartFile file) {
		return cloudinaryService.uploadMedicalDocument(sessionId, medicalRecordId, file);
	}
}
