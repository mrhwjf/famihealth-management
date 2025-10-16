package com.famihealth.family_health_management.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordDto {
	private Integer id;
	private Integer familyMemberId;
	private Integer doctorId;
	private Integer facilityId;
	private LocalDate date;
	private String diagnosis;
	private String treatment;
	private LocalDate followUpDate;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	// Omitting prescriptions and documents for brevity
}
