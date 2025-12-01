package com.famihealth.family_health_management.dto.response.relationships_to_creator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelationshipsToCreatorDto {
	private Integer id;
	private String relationshipName;
	private String description;
}
