package com.famihealth.family_health_management.dto.request.vaccination_reconrd;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VaccinationRecordUpdateRequest {
	@NotBlank
	private LocalDate administeredDate;

	@NotBlank
	private LocalDate nextDueDate;
}
