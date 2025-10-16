package com.famihealth.family_health_management.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberSummaryDto {
	private Integer id;
	private String name;
	private LocalDate dob;
	private String gender;
	private String bloodType;
	private String phone;
	private String relationshipToCreator;
}
