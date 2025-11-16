package com.famihealth.family_health_management.dto.request.member_access;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberAccessUpdateRequest {
	private Integer doctorId;
}
