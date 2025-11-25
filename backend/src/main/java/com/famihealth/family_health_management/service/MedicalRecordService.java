package com.famihealth.family_health_management.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.medical_document.MedicalDocumentCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_document.MedicalDocumentUpdateRequest;
import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.medical_document.MedicalDocumentDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordDto;

public interface MedicalRecordService {

	MedicalRecordDto createRecord(String sessionId, MedicalRecordCreateRequest request);

	MedicalRecordDto getRecordById(String sessionId, Integer recordId);

	MedicalRecordDto updateRecord(String sessionId, Integer recordId, MedicalRecordUpdateRequest request);

	void deleteRecord(String sessionId, Integer recordId);

	PageResponse<MedicalRecordDto> getRecordsByFamilyMember(String sessionId, Integer familyMemberId,
			Pageable pageable);

	List<MedicalDocumentDto> getDocumentsByRecord(String sessionId, Integer recordId);

	MedicalDocumentDto createDocument(String sessionId, Integer recordId, MedicalDocumentCreateRequest request);

	MedicalDocumentDto updateDocument(String sessionId, Integer documentId, MedicalDocumentUpdateRequest request);

	void deleteDocument(String sessionId, Integer documentId);
}
