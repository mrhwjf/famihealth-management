package com.famihealth.family_health_management.dto.request.family_invite_code;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyInviteCodeUpdateRequest {
	// For now only active can change; code is unique and immutable
	// Active update is done by the family creator or automatically expired when the
	// modal is closed
	private Boolean active;
}
