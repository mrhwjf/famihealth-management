package com.famihealth.family_health_management.dto.response.drug;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrugDto {
	private Integer id;
	private String name;
	private String description;
}
