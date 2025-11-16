package com.famihealth.family_health_management.dto.request.relationship_to_creator;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Update request for RelationshipsToCreator master table
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelationshipsToCreatorUpdateRequest {

	@NotBlank
	@Size(max = 255)
	private String relationshipName;

	@Size(max = 2000)
	private String description;
}
