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
public class VaccinationRecordDto {
	private Integer id;
	private Integer familyMemberId;
	private Integer vaccineId;
	private LocalDate administeredDate;
	private LocalDate nextDueDate;
}
