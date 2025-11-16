package com.famihealth.family_health_management.dto.request.health_stats;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthStatCreateRequest {
	@NotNull
	private Integer familyMemberId;

	@NotNull
	private Integer statsTypeId;

	@NotNull
	private BigDecimal value;
}
