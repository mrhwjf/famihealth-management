package com.famihealth.family_health_management.dto.request.user.doctor;

import com.famihealth.family_health_management.dto.request.doctor_profile.DoctorProfileUpdateRequest;
import com.famihealth.family_health_management.dto.request.user.UserUpdateRequest;

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
public class DoctorUpdateRequest {
	@NotNull
	@Valid
	private UserUpdateRequest user;

	@NotNull
	@Valid
	private DoctorProfileUpdateRequest doctorProfile;
}
