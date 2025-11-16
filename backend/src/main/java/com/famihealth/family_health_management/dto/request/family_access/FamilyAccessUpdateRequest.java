package com.famihealth.family_health_management.dto.request.family_access;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Update request for Family Access
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyAccessUpdateRequest {

	@NotBlank
	private Integer familyId;

	@NotBlank
	private Integer userId;

	// Default is true for the user creating the family, set in the service layer
	// Can change if the creator wants to transfer creator status to an existing
	// member who has an account
	private Boolean familyCreator;
}
