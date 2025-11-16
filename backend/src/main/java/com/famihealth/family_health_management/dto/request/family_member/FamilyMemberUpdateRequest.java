package com.famihealth.family_health_management.dto.request.family_member;

import java.time.LocalDate;

import com.famihealth.family_health_management.enums.BloodType;
import com.famihealth.family_health_management.enums.Gender;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberUpdateRequest {
	// FamilyId is immutable once created

	private Integer userId; // optional link to existing user

	private Integer relationshipToCreatorId;

	@Size(max = 255)
	private String name;

	// Optional fields for more detailed profile

	private LocalDate dob;

	private Gender gender;

	private BloodType bloodType;

	@Size(max = 50)
	private String phone;
}
