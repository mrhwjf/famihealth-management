package com.famihealth.family_health_management.dto.request.appointment;

import java.time.LocalDateTime;

import com.famihealth.family_health_management.enums.AppointmentStatus;

import jakarta.validation.constraints.NotBlank;
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
public class AppointmentUpdateRequest {
	// issuerId is not typically updatable; keep doctor/patient mutable if business
	// allows
	@NotNull
	private Integer patientId;

	@NotNull
	private Integer doctorId;

	@NotNull
	private LocalDateTime appointmentDatetime;

	@Size(max = 255)
	@NotBlank
	private String location;

	private AppointmentStatus status;

	@Size(max = 2000)
	private String notes;
}
