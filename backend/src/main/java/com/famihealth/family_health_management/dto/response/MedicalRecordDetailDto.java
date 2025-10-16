package com.famihealth.family_health_management.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordDetailDto {
	private Integer id;
	private FamilyMemberSummaryDto familyMember;
	private UserSummaryDto doctor;
	private FacilityDto facility; // master table; using existing DTO
	private LocalDate date;
	private String diagnosis;
	private String treatment;
	private LocalDate followUpDate;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	private List<PrescriptionSummaryDto> prescriptions;
	private List<MedicalDocumentDto> documents;
}
