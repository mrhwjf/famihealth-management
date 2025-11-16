package com.famihealth.family_health_management.dto.request.family_invite_code;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyInviteCodeCreateRequest {
	@NotNull
	private Integer familyId;

	@NotNull
	private Integer createdBy;

	// Optional; defaults to true, set in service layer.
	private Boolean active;
}
