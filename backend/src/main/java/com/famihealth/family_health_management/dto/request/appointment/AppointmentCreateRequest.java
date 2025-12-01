package com.famihealth.family_health_management.dto.request.appointment;

import java.time.LocalDateTime;

import com.famihealth.family_health_management.enums.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.FutureOrPresent;
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
public class AppointmentCreateRequest {

	@NotNull
	private Integer patientId;

	@NotNull
	private Integer doctorId;

	@NotNull
	@FutureOrPresent
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime appointmentDatetime;

	@NotBlank
	@Size(max = 255)
	private String reason;

	@Size(max = 4000)
	private String notes;

	private AppointmentStatus status;
}
