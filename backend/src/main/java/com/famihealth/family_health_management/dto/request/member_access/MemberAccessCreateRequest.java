package com.famihealth.family_health_management.dto.request.member_access;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberAccessCreateRequest {
	@NotNull
	private Integer memberId;

	@NotNull
	private Integer doctorId;
}
