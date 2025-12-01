package com.famihealth.family_health_management.dto.request.auth;

import com.famihealth.family_health_management.enums.AuthProvider;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLoginRequest {
	@NotNull
	@Enumerated(EnumType.STRING)
	private AuthProvider provider; // GOOGLE

	@NotNull
	private String token; // Google ID token

	@NotNull
	private String role; // ADMIN, FAMILY, DOCTOR
}
