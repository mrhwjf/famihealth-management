package com.famihealth.family_health_management.dto.request.vaccination_reconrd;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new Vaccination Record.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VaccinationRecordCreateRequest {
	@NotBlank
	private LocalDate administeredDate;
	@NotBlank
	private LocalDate nextDueDate;
}
