package com.famihealth.family_health_management.dto.response.faclitiy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityDto {
	private Integer id;
	private String name;
}
