package com.famihealth.family_health_management.service;

import java.util.Optional;

import com.famihealth.family_health_management.dto.response.auth.SessionData;

public interface SessionService {

	SessionData createSession(Integer userId, String roleName);

	Optional<SessionData> getSession(String sessionId);

	Optional<Integer> getUserId(String sessionId);

	void invalidate(String sessionId);

	boolean isValid(String sessionId);
}
