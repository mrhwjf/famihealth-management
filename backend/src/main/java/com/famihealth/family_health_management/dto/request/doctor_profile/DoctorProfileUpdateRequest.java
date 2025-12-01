package com.famihealth.family_health_management.dto.request.doctor_profile;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfileUpdateRequest {

	@NotNull
	private Integer facilityId;

	@NotNull
	private Integer specializationId;

	@NotNull
	private String licenseNumber;

	@NotNull
	private String certificateFileUrl;

	@NotNull
	private Boolean verified;
}
