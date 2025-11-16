package com.famihealth.family_health_management.dto.request.doctor_profile;

import jakarta.validation.constraints.NotNull;

public class DoctorProfileCreateRequest {
	@NotNull
	private Integer doctorId; // Which is the user id

	@NotNull
	private String licenseNumber;

	@NotNull
	private String certificateFileUrl;

	@NotNull
	private Boolean verified;
}
