package com.famihealth.family_health_management.dto.response.member_access;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberAccessDto {
	private Integer memberId;
	private String memberName;
	private Integer doctorId;
	private String doctorName;
}
