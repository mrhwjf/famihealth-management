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
	// Can be null if the record is not linked to a specific doctor
	// or the doctor is unknown
	// or the record exists before the family uses the app.
	// If provided, should be validated in service layer (exists in DB, must be done
	// by doctor, check user's role or permissions).
	private Integer doctorId;

	private Integer facilityId;

	private LocalDate date;

	@Size(max = 2000)
	private String diagnosis;

	@Size(max = 2000)
	private String treatment;

	private LocalDate followUpDate;
}
