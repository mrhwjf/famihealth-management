package com.famihealth.family_health_management.dto.request.password_reset_token;

import java.time.LocalDateTime;

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
public class PasswordResetTokenCreateRequest {
	@NotNull
	private Integer userId;

	@NotBlank
	private String token;

	@NotNull
	private LocalDateTime expiresAt;

	private Boolean used;
}
