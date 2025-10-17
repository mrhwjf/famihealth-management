package com.famihealth.family_health_management.dto.response.family_member;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Set;

import com.famihealth.family_health_management.dto.response.family.FamilySummaryDto;
import com.famihealth.family_health_management.dto.response.relationships_to_creator.RelationshipsToCreatorDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;

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
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate dob;
	private String gender;
	private String bloodType;
	private String phone;
	private Set<UserSummaryDto> doctors;
}
