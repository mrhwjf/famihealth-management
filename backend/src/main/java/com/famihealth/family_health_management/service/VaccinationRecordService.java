package com.famihealth.family_health_management.service;

import java.util.List;

import com.famihealth.family_health_management.dto.request.vaccination_record.VaccinationRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.vaccination_record.VaccinationRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.vaccination_record.VaccinationRecordDto;

public interface VaccinationRecordService {

	VaccinationRecordDto createRecord(String sessionId, Integer memberId, VaccinationRecordCreateRequest request);

	VaccinationRecordDto updateRecord(String sessionId, Integer recordId, VaccinationRecordUpdateRequest request);

	void deleteRecord(String sessionId, Integer recordId);

	VaccinationRecordDto getRecordById(String sessionId, Integer recordId);

	List<VaccinationRecordDto> getRecordsByMemberId(String sessionId, Integer memberId);
}
