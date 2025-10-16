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
public class AppointmentDetailDto {
	private Integer id;

	private UserSummaryDto issuer;
	private FamilyMemberSummaryDto patient;
	private UserSummaryDto doctor;

	private LocalDateTime appointmentDatetime;
	private String location;
	private String status;
	private String notes;
}
