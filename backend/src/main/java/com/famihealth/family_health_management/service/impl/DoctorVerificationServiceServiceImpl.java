package com.famihealth.family_health_management.service.impl;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.doctor_verification.DoctorVerificationFilterRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationDetailDto;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationSummaryDto;
import com.famihealth.family_health_management.service.DoctorVerificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorVerificationServiceServiceImpl implements DoctorVerificationService {
	@Override
	public DoctorVerificationDetailDto create(DoctorVerificationDetailDto req) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'create'");
	}

	@Override
	public DoctorVerificationDetailDto updateById(DoctorVerificationDetailDto req) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'updateById'");
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'deleteById'");
	}

	@Override
	public DoctorVerificationDetailDto getById(Integer id) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'getById'");
	}

	@Override
	public PageResponse<DoctorVerificationSummaryDto> getAll(DoctorVerificationFilterRequest filter,
			Pageable pageable) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'getAll'");
	}

	@Override
	public List<DoctorVerificationSummaryDto> getByKeyword(String field, String keyword) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'getByKeyword'");
	}

	@Override
	public List<DoctorVerificationSummaryDto> filter(Boolean verified) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'filter'");
	}

}
