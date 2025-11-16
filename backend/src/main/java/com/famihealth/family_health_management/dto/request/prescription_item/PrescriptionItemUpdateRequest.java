package com.famihealth.family_health_management.dto.request.prescription_item;

import java.time.LocalDate;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItemUpdateRequest {
	private Integer drugId;

	@Size(max = 255)
	private String dosage;

	@Size(max = 255)
	private String frequency;

	private LocalDate startDate;
	private LocalDate endDate;

	@Size(max = 2000)
	private String instructions;
}
