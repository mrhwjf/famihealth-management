package com.famihealth.family_health_management.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.auth.LoginRequest;
import com.famihealth.family_health_management.dto.request.auth.RegisterRequest;
import com.famihealth.family_health_management.dto.request.auth.ResetPasswordRequest;
import com.famihealth.family_health_management.dto.request.doctor_profile.DoctorProfileCreateRequest;
import com.famihealth.family_health_management.dto.request.user.UserCreateRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.DoctorProfileMapper;
import com.famihealth.family_health_management.mapper.UserMapper;
import com.famihealth.family_health_management.model.DoctorProfile;
import com.famihealth.family_health_management.model.PasswordResetToken;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.PasswordResetTokenRepository;
import com.famihealth.family_health_management.repository.RoleRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.AuthService;
import com.famihealth.family_health_management.service.SessionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

	private static final String ROLE_ADMIN = "ADMIN";
	private static final String ROLE_FAMILY = "FAMILY";
	private static final String ROLE_DOCTOR = "DOCTOR";
	private static final long PASSWORD_RESET_TOKEN_MINUTES = 30L;

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final SessionService sessionService;
	private final UserMapper userMapper;
	private final DoctorProfileMapper doctorProfileMapper;

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
		return AuthResponse.builder()
				.sessionId(sessionData.getSessionId())
				.session(sessionData)
				.user(userMapper.toDetailDto(user))
				.build();
	}

	@Override
	public void logout(String sessionId) {
		sessionService.invalidate(sessionId);
	}

	@Override
	public UserDetailDto registerAdmin(RegisterRequest req) {
		User user = buildUserFromRequest(req, ROLE_ADMIN);
		return userMapper.toDetailDto(userRepository.save(user));
	}

	@Override
	public UserDetailDto registerFamily(RegisterRequest req) {
		User user = buildUserFromRequest(req, ROLE_FAMILY);
		return userMapper.toDetailDto(userRepository.save(user));
	}

	@Override
	public UserDetailDto registerDoctor(DoctorCreateRequest req) {
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

		return userMapper.toDetailDto(userRepository.save(user));
	}

	@Override
	public String requestPasswordReset(String email) {
		if (email == null || email.isBlank()) {
			throw new IllegalArgumentException("Email is required");
		}
		Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());
		if (userOpt.isEmpty()) {
			return null; // silently succeed to prevent user enumeration
		}

		User user = userOpt.get();
		String tokenValue = UUID.randomUUID().toString();

		PasswordResetToken token = new PasswordResetToken();
		token.setUser(user);
		token.setToken(tokenValue);
		token.setExpiresAt(LocalDateTime.now().plusMinutes(PASSWORD_RESET_TOKEN_MINUTES));
		token.setUsed(Boolean.FALSE);
		passwordResetTokenRepository.save(token);
		return tokenValue;
	}

	@Override
	public void resetPassword(ResetPasswordRequest req) {
		if (!req.getNewPassword().equals(req.getConfirmPassword())) {
			throw new IllegalArgumentException("Passwords do not match");
		}

		PasswordResetToken token = passwordResetTokenRepository.findByToken(req.getToken())
				.orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

		if (Boolean.TRUE.equals(token.getUsed())) {
			throw new IllegalArgumentException("Token has already been used");
		}

		if (token.getExpiresAt() != null && token.getExpiresAt().isBefore(LocalDateTime.now())) {
			throw new IllegalArgumentException("Token has expired");
		}

		User user = token.getUser();
		if (user == null) {
			throw new IllegalStateException("Token is not linked to any user");
		}

		user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
		userRepository.save(user);

		token.setUsed(Boolean.TRUE);
		passwordResetTokenRepository.save(token);
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
}
