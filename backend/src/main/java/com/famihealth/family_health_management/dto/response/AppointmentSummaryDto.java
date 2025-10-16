package com.famihealth.family_health_management.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentSummaryDto {
	private Integer id;
	private String issuerName;
	private String patientName;
	private String doctorName;
	private LocalDateTime appointmentDatetime;
	private String location;
	private String status;
	private String notes;
}
