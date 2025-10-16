package com.famihealth.family_health_management.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthStatDetailDto {
	private Integer id;
	private FamilyMemberSummaryDto familyMember;
	private HealthStatsTypeDto statsType; // master table
	private BigDecimal value;
	private LocalDateTime createdAt;
}
