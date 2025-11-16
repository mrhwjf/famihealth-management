package com.famihealth.family_health_management.dto.request.prescription;

import java.time.LocalDateTime;

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
public class PrescriptionCreateRequest {
	@NotNull
	private Integer medicalRecordId;

	@NotNull
	private LocalDateTime prescribedDate;

	@Size(max = 2000)
	private String notes;
}
