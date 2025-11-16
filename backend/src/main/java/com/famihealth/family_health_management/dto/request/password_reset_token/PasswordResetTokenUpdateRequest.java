package com.famihealth.family_health_management.dto.request.password_reset_token;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetTokenUpdateRequest {
	private LocalDateTime expiresAt;
	private Boolean used;
}
