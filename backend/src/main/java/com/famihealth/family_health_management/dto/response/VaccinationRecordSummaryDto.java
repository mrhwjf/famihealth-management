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
public class VaccinationRecordSummaryDto {
	private Integer id;
	private String familyMemberName;
	private String vaccineName;
	private LocalDate administeredDate;
	private LocalDate nextDueDate;
}
