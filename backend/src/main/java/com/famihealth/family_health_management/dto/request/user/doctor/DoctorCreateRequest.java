package com.famihealth.family_health_management.dto.request.user.doctor;

import com.famihealth.family_health_management.dto.request.doctor_profile.DoctorProfileCreateRequest;
import com.famihealth.family_health_management.dto.request.user.UserCreateRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorCreateRequest {
	@NotNull
	@Valid
	private UserCreateRequest user;

	@NotNull
	@Valid
	private DoctorProfileCreateRequest doctorProfile;
}
