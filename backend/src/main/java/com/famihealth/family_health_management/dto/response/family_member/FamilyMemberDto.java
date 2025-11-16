package com.famihealth.family_health_management.dto.response.family_member;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.famihealth.family_health_management.enums.BloodType;
import com.famihealth.family_health_management.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberDto {
	private Integer id;
	private Integer familyId;
	private Integer userId;
	private Integer relationshipToCreatorId;
	private String name;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate dob;
	private Gender gender;
	private BloodType bloodType;
	private String phone;
}
