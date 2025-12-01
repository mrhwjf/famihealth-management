package com.famihealth.family_health_management.service;

import org.springframework.web.multipart.MultipartFile;

import com.famihealth.family_health_management.dto.response.common.FileUploadResponseDto;
import com.famihealth.family_health_management.dto.response.medical_document.MedicalDocumentDto;

public interface CloudinaryService {

	FileUploadResponseDto uploadUserProfilePicture(String sessionId, MultipartFile file);

	FileUploadResponseDto uploadFamilyMemberProfilePicture(String sessionId, Integer memberId, MultipartFile file);

	FileUploadResponseDto uploadDoctorCertificate(String sessionId, Integer doctorId, MultipartFile file);

	MedicalDocumentDto uploadMedicalDocument(String sessionId, Integer medicalRecordId, MultipartFile file);

	void deleteFile(String url);
}
