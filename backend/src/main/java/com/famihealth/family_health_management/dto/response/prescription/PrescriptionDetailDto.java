package com.famihealth.family_health_management.dto.response.prescription;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordSummaryDto;
import com.famihealth.family_health_management.dto.response.prescription_item.PrescriptionItemSummaryDto;

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
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime prescribedDate;
	private String notes;

	private List<PrescriptionItemSummaryDto> items;
}
