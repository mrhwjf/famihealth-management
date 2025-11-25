package com.famihealth.family_health_management.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordRequest {
	@NotBlank
	private String token;

	@NotBlank
	@Size(min = 8, message = "Password must be at least 8 characters long")
	private String newPassword;

	@NotBlank
	private String confirmPassword;
}
