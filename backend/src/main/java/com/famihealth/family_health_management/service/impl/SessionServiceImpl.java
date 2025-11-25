package com.famihealth.family_health_management.service.impl;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.service.SessionService;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {

	private static final Duration SESSION_TTL = Duration.ofHours(24);
	private static final String SESSION_KEY_PREFIX = "session:";

	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;

	@Override
	public SessionData createSession(Integer userId, String roleName) {
		String sessionId = generateSessionId();
		Instant now = Instant.now();
		Instant expiresAt = now.plus(SESSION_TTL);
		SessionData sessionData = SessionData.builder()
				.sessionId(sessionId)
				.userId(userId)
				.role(roleName)
				.createdAt(now)
				.expiresAt(expiresAt)
				.build();

		redisTemplate.opsForValue().set(buildKey(sessionId), sessionData, SESSION_TTL);
		return sessionData;
	}

	@Override
	public Optional<SessionData> getSession(String sessionId) {
		if (sessionId == null || sessionId.isBlank()) {
			return Optional.empty();
		}
		Object stored = redisTemplate.opsForValue().get(buildKey(sessionId));
		if (stored instanceof SessionData session) {
			return Optional.of(session);
		}
		if (stored != null) {
			try {
				SessionData session = objectMapper.convertValue(stored, SessionData.class);
				return Optional.ofNullable(session);
			} catch (IllegalArgumentException ex) {
				return Optional.empty();
			}
		}
		return Optional.empty();
	}

	@Override
	public Optional<Integer> getUserId(String sessionId) {
		return getSession(sessionId).map(SessionData::getUserId);
	}

	@Override
	public void invalidate(String sessionId) {
		if (sessionId == null || sessionId.isBlank()) {
			return;
		}
		redisTemplate.delete(buildKey(sessionId));
	}

	@Override
	public boolean isValid(String sessionId) {
		return getSession(sessionId).isPresent();
	}

	private String buildKey(String sessionId) {
		return SESSION_KEY_PREFIX + sessionId;
	}

	private String generateSessionId() {
		String id;
		do {
			id = java.util.UUID.randomUUID().toString();
		} while (isValid(id));
		return id;
	}
}
