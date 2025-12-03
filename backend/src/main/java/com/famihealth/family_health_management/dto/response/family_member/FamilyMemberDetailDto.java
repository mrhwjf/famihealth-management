package com.famihealth.family_health_management.dto.response.family_member;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.famihealth.family_health_management.dto.response.allergy.AllergyDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;
import com.famihealth.family_health_management.dto.response.vaccination_record.VaccinationRecordDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberDetailDto {
	private Integer id;
	private UserSummaryDto user;
	private String relationshipToCreator;
	private String name;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate dob;
	private String gender;
	private String bloodType;
	private String phone;
	private String profileUrl;
	private List<AllergyDto> allergies;
	private List<VaccinationRecordDto> vaccinationRecords;
}
