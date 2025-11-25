package com.famihealth.family_health_management.dto.request.family_member;

import java.time.LocalDate;

import com.famihealth.family_health_management.enums.BloodType;
import com.famihealth.family_health_management.enums.Gender;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
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

	private Integer relationshipToCreatorId;

	@Size(max = 255)
	@NotNull
	private String name;

	@NotNull
	private LocalDate dob;

	@NotNull
	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Enumerated(EnumType.STRING)
	private BloodType bloodType;

	@Size(max = 50)
	private String phone;

	private String profileUrl;
}
