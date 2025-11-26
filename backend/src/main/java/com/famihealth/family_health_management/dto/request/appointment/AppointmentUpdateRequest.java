package com.famihealth.family_health_management.dto.request.appointment;

import java.time.LocalDateTime;

import com.famihealth.family_health_management.enums.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.FutureOrPresent;
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

	@FutureOrPresent
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime appointmentDatetime;

	@Size(max = 255)
	private String location;

	private AppointmentStatus status;

	@Size(max = 4000)
	private String notes;
}
