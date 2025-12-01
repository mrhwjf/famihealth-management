package com.famihealth.family_health_management.service.impl;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.famihealth.family_health_management.dto.request.auth.LoginRequest;
import com.famihealth.family_health_management.dto.request.auth.RegisterRequest;
import com.famihealth.family_health_management.dto.request.auth.PasswordResetConfirmRequest;
import com.famihealth.family_health_management.dto.request.auth.PasswordResetRequest;
import com.famihealth.family_health_management.dto.request.doctor_profile.DoctorProfileCreateRequest;
import com.famihealth.family_health_management.dto.request.user.UserCreateRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.DoctorProfileMapper;
import com.famihealth.family_health_management.mapper.UserMapper;
import com.famihealth.family_health_management.model.DoctorProfile;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.RoleRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.AuthService;
import com.famihealth.family_health_management.service.EmailService;
import com.famihealth.family_health_management.service.SessionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

	private static final String ROLE_ADMIN = "ADMIN";
	private static final String ROLE_FAMILY = "FAMILY";
	private static final String ROLE_DOCTOR = "DOCTOR";
	private static final String OTP_KEY_PREFIX = "otp:forgot-password:";
	private static final Duration OTP_TTL = Duration.ofMinutes(5);
	private static final int OTP_LENGTH = 6;
	private static final int MAX_OTP_ATTEMPTS = 5;
	private static final String PASSWORD_RESET_SUBJECT = "Password Reset Request";
	private static final String APP_NAME = "Famihealth";

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;
	private final SessionService sessionService;
	private final UserMapper userMapper;
	private final DoctorProfileMapper doctorProfileMapper;
	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;
	private final EmailService emailService;
	private final SecureRandom secureRandom = new SecureRandom();

	@Override
	@Transactional(readOnly = true)
	public AuthResponse login(LoginRequest req) {
		String identifier = Optional.ofNullable(req.getPhoneOrEmail())
				.map(String::trim)
				.orElse("");
		if (identifier.isBlank()) {
			throw new IllegalArgumentException("Email or phone is required");
		}

		User user = userRepository.findByEmailIgnoreCaseOrPhone(identifier, identifier)
				.orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

		if (Boolean.TRUE.equals(user.getLocked())) {
			throw new ForbiddenException("Account is locked");
		}

		if (user.getPasswordHash() == null || !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
			throw new IllegalArgumentException("Invalid credentials");
		}

		String roleName = user.getRole() != null ? user.getRole().getName() : null;
		SessionData sessionData = sessionService.createSession(user.getId(), roleName);
		return buildAuthResponse(user, sessionData);
	}

	@Override
	public void logout(String sessionId) {
		sessionService.invalidate(sessionId);
	}

	@Override
	public AuthResponse registerAdmin(RegisterRequest req) {
		User user = buildUserFromRequest(req, ROLE_ADMIN);
		User saved = userRepository.save(user);
		return buildAuthResponse(saved);
	}

	@Override
	public AuthResponse registerFamily(RegisterRequest req) {
		User user = buildUserFromRequest(req, ROLE_FAMILY);
		User saved = userRepository.save(user);
		return buildAuthResponse(saved);
	}

	@Override
	public AuthResponse registerDoctor(DoctorCreateRequest req) {
		UserCreateRequest userReq = req.getUser();
		if (userReq == null) {
			throw new IllegalArgumentException("User information is required");
		}

		validateUniqueness(userReq.getEmail(), userReq.getPhone());
		String email = userReq.getEmail() == null ? null : userReq.getEmail().trim();
		String phone = userReq.getPhone() == null ? null : userReq.getPhone().trim();
		Role doctorRole = roleRepository.findByName(ROLE_DOCTOR)
				.orElseThrow(() -> new ResourceNotFoundException("Role '" + ROLE_DOCTOR + "' not found"));

		User user = User.builder()
				.name(userReq.getName())
				.email(email)
				.phone(phone)
				.passwordHash(passwordEncoder.encode(userReq.getPassword()))
				.role(doctorRole)
				.locked(Boolean.FALSE)
				.build();

		DoctorProfileCreateRequest profileReq = req.getDoctorProfile();
		if (profileReq != null) {
			DoctorProfile profile = doctorProfileMapper.toEntity(profileReq);
			profile.setDoctor(user);
			user.setDoctorProfile(profile);
		}

		User saved = userRepository.save(user);
		return buildAuthResponse(saved);
	}

	@Override
	public void requestPasswordReset(PasswordResetRequest request) {
		String normalizedEmail = normalizeEmail(request.getEmail());
		if (normalizedEmail == null) {
			throw new IllegalArgumentException("Email is required");
		}

		User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User with the provided email was not found"));

		String otp = generateOtp();
		storeOtp(normalizedEmail, otp);
		String recipientEmail = user.getEmail() == null ? normalizedEmail : user.getEmail();
		emailService.sendEmail(recipientEmail, PASSWORD_RESET_SUBJECT,
				buildOtpEmailBody(user.getName(), otp));
	}

	@Override
	public void verifyOtpAndResetPassword(PasswordResetConfirmRequest request) {
		String normalizedEmail = normalizeEmail(request.getEmail());
		if (normalizedEmail == null) {
			throw new IllegalArgumentException("Email is required");
		}

		User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User with the provided email was not found"));

		String key = buildOtpKey(normalizedEmail);
		Object stored = redisTemplate.opsForValue().get(key);
		OtpPayload payload = mapToOtpPayload(stored);
		if (payload == null) {
			throw new BadRequestException("OTP is invalid or has expired");
		}

		if (payload.getAttempts() >= MAX_OTP_ATTEMPTS) {
			redisTemplate.delete(key);
			throw new BadRequestException("Maximum OTP attempts exceeded. Please request a new code.");
		}

		if (!payload.getCode().equals(request.getOtp())) {
			OtpPayload updated = new OtpPayload(payload.getCode(), payload.getAttempts() + 1);
			Duration remainingTtl = resolveRemainingTtl(key);
			redisTemplate.opsForValue().set(key, updated, remainingTtl);
			throw new BadRequestException("OTP is invalid or has expired");
		}

		user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
		redisTemplate.delete(key);
	}

	private User buildUserFromRequest(RegisterRequest req, String roleName) {
		validateUniqueness(req.getEmail(), req.getPhone());
		String email = req.getEmail() == null ? null : req.getEmail().trim();
		String phone = req.getPhone() == null ? null : req.getPhone().trim();
		Role role = roleRepository.findByName(roleName)
				.orElseThrow(() -> new ResourceNotFoundException("Role '" + roleName + "' not found"));
		return User.builder()
				.name(req.getName())
				.email(email)
				.phone(phone)
				.passwordHash(passwordEncoder.encode(req.getPassword()))
				.role(role)
				.locked(Boolean.FALSE)
				.build();
	}

	private void validateUniqueness(String email, String phone) {
		if (email != null) {
			String normalizedEmail = email.trim();
			if (!normalizedEmail.isEmpty() && userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
				throw new IllegalArgumentException("Email is already in use");
			}
		}
		if (phone != null) {
			String normalizedPhone = phone.trim();
			if (!normalizedPhone.isEmpty() && userRepository.existsByPhone(normalizedPhone)) {
				throw new IllegalArgumentException("Phone number is already in use");
			}
		}
	}

	private AuthResponse buildAuthResponse(User user) {
		String roleName = user.getRole() != null ? user.getRole().getName() : null;
		SessionData sessionData = sessionService.createSession(user.getId(), roleName);
		return buildAuthResponse(user, sessionData);
	}

	private AuthResponse buildAuthResponse(User user, SessionData sessionData) {
		return AuthResponse.builder()
				.sessionId(sessionData.getSessionId())
				.session(sessionData)
				.user(userMapper.toDetailDto(user))
				.build();
	}

	private String normalizeEmail(String email) {
		if (email == null) {
			return null;
		}
		String trimmed = email.trim();
		return trimmed.isEmpty() ? null : trimmed.toLowerCase();
	}

	private String buildOtpKey(String email) {
		return OTP_KEY_PREFIX + email;
	}

	private String generateOtp() {
		int bound = (int) Math.pow(10, OTP_LENGTH);
		int value = secureRandom.nextInt(bound);
		return String.format("%0" + OTP_LENGTH + "d", value);
	}

	private void storeOtp(String email, String otp) {
		redisTemplate.opsForValue().set(buildOtpKey(email), new OtpPayload(otp, 0), OTP_TTL);
	}

	private OtpPayload mapToOtpPayload(Object stored) {
		if (stored == null) {
			return null;
		}
		if (stored instanceof OtpPayload payload) {
			return payload;
		}
		try {
			return objectMapper.convertValue(stored, OtpPayload.class);
		} catch (IllegalArgumentException ex) {
			return null;
		}
	}

	private Duration resolveRemainingTtl(String key) {
		Long ttlSeconds = redisTemplate.getExpire(key);
		if (ttlSeconds == null || ttlSeconds <= 0) {
			return OTP_TTL;
		}
		return Duration.ofSeconds(ttlSeconds);
	}

	private String buildOtpEmailBody(String userName, String otp) {
		String recipientName = (userName == null || userName.isBlank()) ? "User" : userName;
		return String.format(
				"""
						Dear %s,

						You requested a password reset. Please use the OTP below to reset your password. This OTP is valid for 5 minutes.

						OTP: %s

						If you did not request this, please ignore this email.

						Best regards,
						%s Team
						""",
				recipientName,
				otp,
				APP_NAME);
	}

	private static final class OtpPayload {
		private String code;
		private int attempts;

		private OtpPayload() {
		}

		private OtpPayload(String code, int attempts) {
			this.code = code;
			this.attempts = attempts;
		}

		public String getCode() {
			return code;
		}

		@SuppressWarnings("unused")
		public void setCode(String code) {
			this.code = code;
		}

		public int getAttempts() {
			return attempts;
		}

		@SuppressWarnings("unused")
		public void setAttempts(int attempts) {
			this.attempts = attempts;
		}
	}
}
