package com.famihealth.family_health_management.dto.request.doctor_verification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorVerificationFilterRequest {
	private String field;
	private String keyword;
	private Boolean verified;
}
