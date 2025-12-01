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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class FileUploadController {

	private final CloudinaryService cloudinaryService;

	@PostMapping(value = "/profile/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public FileUploadResponseDto uploadProfilePicture(
			@RequestHeader("X-Session-Id") String sessionId,
			@RequestParam("file") MultipartFile file) {
		return cloudinaryService.uploadUserProfilePicture(sessionId, file);
	}

	@PostMapping(value = "/family-members/{id}/profile/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public FileUploadResponseDto uploadFamilyMemberProfilePicture(
			@RequestHeader("X-Session-Id") String sessionId,
			@PathVariable("id") Integer memberId,
			@RequestParam("file") MultipartFile file) {
		return cloudinaryService.uploadFamilyMemberProfilePicture(sessionId, memberId, file);
	}

	@PostMapping(value = "/doctor-profiles/{doctorId}/certificate/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public FileUploadResponseDto uploadDoctorCertificate(
			@RequestHeader("X-Session-Id") String sessionId,
			@PathVariable("doctorId") Integer doctorId,
			@RequestParam("file") MultipartFile file) {
		return cloudinaryService.uploadDoctorCertificate(sessionId, doctorId, file);
	}

	@PostMapping(value = "/medical-documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public MedicalDocumentDto uploadMedicalDocument(
			@RequestHeader("X-Session-Id") String sessionId,
			@RequestParam("medicalRecordId") Integer medicalRecordId,
			@RequestParam("file") MultipartFile file) {
		return cloudinaryService.uploadMedicalDocument(sessionId, medicalRecordId, file);
	}
}
