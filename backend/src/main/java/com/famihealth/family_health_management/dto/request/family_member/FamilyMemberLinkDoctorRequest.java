package com.famihealth.family_health_management.dto.request.family_member;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberLinkDoctorRequest {
	@NotNull
	private Integer doctorId;
}
