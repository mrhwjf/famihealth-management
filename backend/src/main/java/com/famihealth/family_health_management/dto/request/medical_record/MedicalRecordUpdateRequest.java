package com.famihealth.family_health_management.dto.request.medical_record;

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
public class MedicalRecordUpdateRequest {

	private Integer facilityId;

	private LocalDate date;

	@Size(max = 2000)
	private String diagnosis;

	@Size(max = 2000)
	private String treatment;

	private LocalDate followUpDate;
}
