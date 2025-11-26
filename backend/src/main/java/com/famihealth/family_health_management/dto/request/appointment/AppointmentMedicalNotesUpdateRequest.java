package com.famihealth.family_health_management.dto.request.appointment;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentMedicalNotesUpdateRequest {

	@Size(max = 4000)
	private String medicalNotes;
}
