package com.famihealth.family_health_management.dto.request.health_stats_type;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Create request for HealthStatsType master table
 */
@Data
public class HealthStatsTypeCreateRequest {

	@NotBlank
	@Size(max = 255)
	private String name;

	@Size(max = 255)
	private String measurementUnit;

	@DecimalMin(value = "-999999.99", inclusive = true)
	@DecimalMax(value = "999999.99", inclusive = true)
	private BigDecimal normalRangeMin;

	@DecimalMin(value = "-999999.99", inclusive = true)
	@DecimalMax(value = "999999.99", inclusive = true)
	private BigDecimal normalRangeMax;

	@Size(max = 2000)
	private String description;
}
