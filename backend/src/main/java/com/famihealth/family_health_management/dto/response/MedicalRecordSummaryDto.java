package com.famihealth.family_health_management.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordSummaryDto {
	private Integer id;
	private String familyMemberName;
	private String doctorName;
	private String facilityName;
	private LocalDate date;
	private String diagnosis;
	private String treatment;
	private LocalDate followUpDate;
}
