package com.famihealth.family_health_management.dto.request.health_stat;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthStatUpdateRequest {

	@NotNull
	@DecimalMin(value = "0.0")
	@Digits(integer = 12, fraction = 4)
	private BigDecimal value;

	@Positive
	private Integer statsTypeId;
}
