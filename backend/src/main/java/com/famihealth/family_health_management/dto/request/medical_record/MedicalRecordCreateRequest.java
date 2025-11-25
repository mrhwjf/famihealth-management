package com.famihealth.family_health_management.dto.request.medical_record;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordCreateRequest {

	@NotNull
	private Integer familyMemberId;

	private Integer facilityId;

	@NotNull
	private LocalDate date;

	@Size(max = 2000)
	private String diagnosis;

	@Size(max = 2000)
	private String treatment;

	private LocalDate followUpDate;
}
