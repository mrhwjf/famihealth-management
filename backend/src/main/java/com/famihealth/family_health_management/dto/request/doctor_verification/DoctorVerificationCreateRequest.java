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
public class DoctorVerificationCreateRequest {
	@NotNull
	private Integer doctorId;

	// adminId and status may be set by system/workflow; allow optional
	private Integer adminId;

	// Default can be set in service layer, value: PENDING if doctor submits for
	// verification
	private VerificationStatus status;

	@Size(max = 2000)
	private String remarks;
}
