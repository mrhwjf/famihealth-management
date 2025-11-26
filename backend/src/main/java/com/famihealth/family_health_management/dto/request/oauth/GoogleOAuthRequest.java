package com.famihealth.family_health_management.dto.request.oauth;

import com.famihealth.family_health_management.enums.RoleType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoogleOAuthRequest {
	@NotBlank
	private String idToken;

	@NotNull
	private RoleType chosenRole;
}
