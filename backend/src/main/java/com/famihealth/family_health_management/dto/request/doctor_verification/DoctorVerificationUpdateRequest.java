package com.famihealth.family_health_management.dto.request.doctor_verification;

import com.famihealth.family_health_management.enums.VerificationStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorVerificationUpdateRequest {
	@NotNull
	private Integer adminId;

	@NotNull
	private VerificationStatus status;

	@Size(max = 2000)
	private String remarks;
}
