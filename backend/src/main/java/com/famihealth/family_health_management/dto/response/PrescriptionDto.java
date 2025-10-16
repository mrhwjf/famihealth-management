package com.famihealth.family_health_management.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionDto {
	private Integer id;
	private Integer medicalRecordId;
	private LocalDateTime prescribedDate;
	private String notes;
}
