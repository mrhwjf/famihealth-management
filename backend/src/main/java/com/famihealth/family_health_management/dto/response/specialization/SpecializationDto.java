package com.famihealth.family_health_management.dto.response.specialization;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecializationDto {
	private Integer id;
	private String name;
	private String description;
}
