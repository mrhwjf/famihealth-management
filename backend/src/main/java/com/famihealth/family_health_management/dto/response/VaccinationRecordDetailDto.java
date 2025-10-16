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
public class VaccinationRecordDetailDto {
	private Integer id;
	private FamilyMemberSummaryDto familyMember;
	private VaccineDto vaccine; // master table
	private LocalDate administeredDate;
	private LocalDate nextDueDate;
}
