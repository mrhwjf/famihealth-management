package com.famihealth.family_health_management.service;

import com.famihealth.family_health_management.dto.request.doctor_verification.DoctorVerificationFilterRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationDetailDto;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationSummaryDto;

import java.util.List;

import org.springframework.data.domain.Pageable;

public interface DoctorVerificationService {
	DoctorVerificationDetailDto create(DoctorVerificationDetailDto req);

	DoctorVerificationDetailDto updateById(DoctorVerificationDetailDto req);

	void deleteById(Integer id);

	DoctorVerificationDetailDto getById(Integer id);

	PageResponse<DoctorVerificationSummaryDto> getAll(DoctorVerificationFilterRequest filter,
			Pageable pageable);

	List<DoctorVerificationSummaryDto> getByKeyword(String field, String keyword);

	List<DoctorVerificationSummaryDto> filter(Boolean verified);
}
