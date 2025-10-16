package com.famihealth.family_health_management.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionDetailDto {
	private Integer id;
	private MedicalRecordSummaryDto medicalRecord;
	private LocalDateTime prescribedDate;
	private String notes;

	private List<PrescriptionItemSummaryDto> items;
}
