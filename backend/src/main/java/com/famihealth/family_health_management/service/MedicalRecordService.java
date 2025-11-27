package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.medical_document.MedicalDocumentCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_document.MedicalDocumentUpdateRequest;
import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.medical_document.MedicalDocumentDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordDetailDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordFormDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordSummaryDto;

public interface MedicalRecordService {

	MedicalRecordDetailDto createRecord(String sessionId, MedicalRecordCreateRequest request);

	MedicalRecordDetailDto getRecordById(String sessionId, Integer recordId);

	MedicalRecordDetailDto updateRecord(String sessionId, Integer recordId, MedicalRecordUpdateRequest request);

	void deleteRecord(String sessionId, Integer recordId);

	PageResponse<MedicalRecordSummaryDto> getRecordsByFamilyMember(String sessionId, Integer familyMemberId,
			Pageable pageable);

	MedicalDocumentDto createDocument(String sessionId, Integer recordId, MedicalDocumentCreateRequest request);

	MedicalDocumentDto updateDocument(String sessionId, Integer documentId, MedicalDocumentUpdateRequest request);

	void deleteDocument(String sessionId, Integer documentId);

	MedicalRecordFormDto getMedicalRecordCreateForm(String sessionId);

	MedicalRecordFormDto getMedicalRecordUpdateForm(String sessionId, Integer recordId);
}
