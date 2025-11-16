package com.famihealth.family_health_management.dto.request.health_stats;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthStatUpdateRequest {
	private Integer statsTypeId;
	private BigDecimal value;
}
