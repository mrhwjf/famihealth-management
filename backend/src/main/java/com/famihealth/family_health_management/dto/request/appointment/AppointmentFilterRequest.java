package com.famihealth.family_health_management.dto.request.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.famihealth.family_health_management.enums.AppointmentStatus;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentFilterRequest {

	private String field;

	private String keyword;

	private Integer doctorId;

	@Builder.Default
	private String startDate = LocalDate.now().toString();

	@Builder.Default
	private String endDate = LocalDate.now().toString();

	@Enumerated(EnumType.STRING)
	private AppointmentStatus status;
}
