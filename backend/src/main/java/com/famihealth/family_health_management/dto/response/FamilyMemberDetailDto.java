package com.famihealth.family_health_management.dto.response;

import java.time.LocalDate;
import java.util.Set;

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
	private FamilySummaryDto family;
	private UserSummaryDto user;
	private RelationshipsToCreatorDto relationshipToCreator; // master table DTO already exists
	private String name;
	private LocalDate dob;
	private String gender;
	private String bloodType;
	private String phone;
	private Set<UserSummaryDto> doctors;
}
