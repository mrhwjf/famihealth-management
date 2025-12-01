package com.famihealth.family_health_management.dto.response.auth;

import com.famihealth.family_health_management.dto.response.user.UserDetailDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
	private String sessionId;
	private SessionData session;
	private UserDetailDto user;
}
