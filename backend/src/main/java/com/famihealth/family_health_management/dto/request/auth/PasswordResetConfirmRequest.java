package com.famihealth.family_health_management.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetConfirmRequest {

	@NotBlank
	@Email
	private String email;

	@NotBlank
	@Pattern(regexp = "^\\d{6}$", message = "OTP must be a 6-digit code")
	private String otp;

	@NotBlank
	@Size(min = 8, max = 128)
	private String newPassword;
}
