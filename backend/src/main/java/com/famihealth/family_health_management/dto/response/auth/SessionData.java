package com.famihealth.family_health_management.dto.response.auth;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionData implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

	private String sessionId;
	private Integer userId;
	private String role;

	@JsonFormat(shape = JsonFormat.Shape.STRING)
	private Instant createdAt;

	@JsonFormat(shape = JsonFormat.Shape.STRING)
	private Instant expiresAt;
}
