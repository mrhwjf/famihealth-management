package com.famihealth.family_health_management.dto.response.prescription_item;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

import com.famihealth.family_health_management.dto.response.drug.DrugDto;
import com.famihealth.family_health_management.dto.response.prescription.PrescriptionSummaryDto;

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
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate startDate;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate endDate;
	private String instructions;
}
