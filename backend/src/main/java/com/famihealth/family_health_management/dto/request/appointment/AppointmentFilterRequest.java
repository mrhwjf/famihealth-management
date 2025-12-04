package com.famihealth.family_health_management.dto.request.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.famihealth.family_health_management.enums.AppointmentStatus;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentFilterRequest {

	private String field;

	private String keyword;

	private Integer doctorId;

	private String startDate;

	private String endDate;

	@Enumerated(EnumType.STRING)
	private AppointmentStatus status;
}
