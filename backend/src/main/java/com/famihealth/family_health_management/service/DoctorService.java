package com.famihealth.family_health_management.service;

import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorUpdateRequest;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;

public interface DoctorService {
	UserDetailDto create(DoctorCreateRequest req);

	UserDetailDto update(DoctorUpdateRequest req, Integer id);

	// Other operations (such as fetch, delete, filter) already handled in
	// UserService //
}
