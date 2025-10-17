package com.famihealth.family_health_management.dto.response.health_stats_type;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthStatsTypeDto {
	private Integer id;
	private String measurementUnit;
	private String name;
	private BigDecimal normalRangeMin;
	private BigDecimal normalRangeMax;
	private String description;
}
