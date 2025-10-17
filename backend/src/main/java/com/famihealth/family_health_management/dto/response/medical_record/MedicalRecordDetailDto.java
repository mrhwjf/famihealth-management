package com.famihealth.family_health_management.dto.response.medical_record;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.List;

import com.famihealth.family_health_management.dto.response.faclitiy.FacilityDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberSummaryDto;
import com.famihealth.family_health_management.dto.response.medical_document.MedicalDocumentDto;
import com.famihealth.family_health_management.dto.response.prescription.PrescriptionSummaryDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;

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
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate date;
	private String diagnosis;
	private String treatment;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate followUpDate;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime createdAt;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime updatedAt;

	private List<PrescriptionSummaryDto> prescriptions;
	private List<MedicalDocumentDto> documents;
}
