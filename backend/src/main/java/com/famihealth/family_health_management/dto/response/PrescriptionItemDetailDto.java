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
public class PrescriptionItemDetailDto {
	private Integer id;
	private PrescriptionSummaryDto prescription;
	private DrugDto drug; // master table
	private String dosage;
	private String frequency;
	private LocalDate startDate;
	private LocalDate endDate;
	private String instructions;
}
