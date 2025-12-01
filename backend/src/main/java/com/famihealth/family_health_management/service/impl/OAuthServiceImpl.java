package com.famihealth.family_health_management.service.impl;

import java.util.EnumSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.famihealth.family_health_management.dto.request.oauth.GoogleOAuthRequest;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.enums.AuthProvider;
import com.famihealth.family_health_management.enums.RoleType;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.UserMapper;
import com.famihealth.family_health_management.model.DoctorProfile;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.DoctorProfileRepository;
import com.famihealth.family_health_management.repository.RoleRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.OAuthService;
import com.famihealth.family_health_management.service.SessionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OAuthServiceImpl implements OAuthService {

	private static final String GOOGLE_EMAIL_VERIFIED_CLAIM = "email_verified";
	private static final String GOOGLE_NAME_CLAIM = "name";
	private static final String GOOGLE_PICTURE_CLAIM = "picture";

	private static final Set<RoleType> ALLOWED_REGISTRATION_ROLES = EnumSet.of(RoleType.DOCTOR, RoleType.FAMILY);

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final DoctorProfileRepository doctorProfileRepository;
	private final SessionService sessionService;
	private final UserMapper userMapper;
	@Qualifier("googleIdTokenDecoder")
	private final JwtDecoder googleIdTokenDecoder;

	@Override
	public AuthResponse handleGoogleLogin(GoogleOAuthRequest request) {
		RoleType requestedRole = requireAllowedRole(request.getChosenRole());
		Jwt jwt = decodeIdToken(request.getIdToken());
		String googleUserId = jwt.getSubject();
		String email = jwt.getClaimAsString("email");
		if (!StringUtils.hasText(email)) {
			throw new BadRequestException("Google account does not expose an email address");
		}
		Boolean emailVerified = jwt.getClaimAsBoolean(GOOGLE_EMAIL_VERIFIED_CLAIM);
		String name = jwt.getClaimAsString(GOOGLE_NAME_CLAIM);
		String picture = jwt.getClaimAsString(GOOGLE_PICTURE_CLAIM);
		return processUser(googleUserId, email, emailVerified, name, picture, requestedRole);
	}

	@Override
	public AuthResponse handleGoogleLogin(OidcUser oidcUser, String chosenRoleRaw) {
		RoleType requestedRole = parseRole(chosenRoleRaw);
		String googleUserId = oidcUser.getSubject();
		String email = oidcUser.getEmail();
		if (!StringUtils.hasText(email)) {
			throw new BadRequestException("Google account does not expose an email address");
		}
		Boolean emailVerified = oidcUser.getEmailVerified();
		String name = oidcUser.getFullName();
		if (!StringUtils.hasText(name)) {
			name = oidcUser.getPreferredUsername();
		}
		String picture = oidcUser.getPicture();
		return processUser(googleUserId, email, emailVerified, name, picture, requestedRole);
	}

	private AuthResponse processUser(String googleUserId, String email, Boolean emailVerified, String name,
			String picture, RoleType requestedRole) {
		Optional<User> existingOpt = userRepository.findByEmailIgnoreCase(email);
		if (existingOpt.isEmpty() && Boolean.FALSE.equals(emailVerified)) {
			throw new ForbiddenException("Google account email address must be verified");
		}
		if (existingOpt.isPresent()) {
			User existingUser = existingOpt.get();
			if (requestedRole != null && existingUser.getRole() != null
					&& !existingUser.getRole().getName().equalsIgnoreCase(requestedRole.name())) {
				throw new BadRequestException("Account already registered as " + existingUser.getRole().getName());
			}
			ensureGoogleAccount(existingUser);
			if (existingUser.getProviderId() == null
					|| (googleUserId != null && !Objects.equals(existingUser.getProviderId(), googleUserId))) {
				existingUser.setProviderId(googleUserId);
			}
			boolean updated = false;
			if (StringUtils.hasText(name) && !name.equals(existingUser.getName())) {
				existingUser.setName(name);
				updated = true;
			}
			if (StringUtils.hasText(picture) && !picture.equals(existingUser.getProfileUrl())) {
				existingUser.setProfileUrl(picture);
				updated = true;
			}
			if (updated) {
				existingUser = userRepository.save(existingUser);
			}
			return buildAuthResponse(existingUser);
		}

		RoleType roleToAssign = requireRoleForNewUser(requestedRole);
		Role role = roleRepository.findByName(roleToAssign.name())
				.orElseThrow(() -> new ResourceNotFoundException("Role not configured: " + roleToAssign.name()));

		User newUser = User.builder()
				.role(role)
				.email(email)
				.name(name)
				.phone(null)
				.profileUrl(picture)
				.passwordHash(null)
				.authProvider(AuthProvider.GOOGLE)
				.providerId(googleUserId)
				.locked(false)
				.build();

		User savedUser = userRepository.save(newUser);
		if (roleToAssign == RoleType.DOCTOR) {
			DoctorProfile profile = DoctorProfile.builder()
					.doctor(savedUser)
					.doctorId(savedUser.getId())
					.licenseNumber(null)
					.certificateFileUrl(null)
					.verified(false)
					.build();
			doctorProfileRepository.save(profile);
			savedUser.setDoctorProfile(profile);
		}

		return buildAuthResponse(savedUser);
	}

	private AuthResponse buildAuthResponse(User user) {
		String roleName = user.getRole() != null ? user.getRole().getName() : null;
		SessionData sessionData = sessionService.createSession(user.getId(), roleName);
		return AuthResponse.builder()
				.sessionId(sessionData.getSessionId())
				.session(sessionData)
				.user(userMapper.toDetailDto(user))
				.build();
	}

	private RoleType requireAllowedRole(RoleType role) {
		if (role == null || !ALLOWED_REGISTRATION_ROLES.contains(role)) {
			throw new BadRequestException("Invalid role selection for Google login");
		}
		return role;
	}

	private RoleType requireRoleForNewUser(RoleType role) {
		if (role == null) {
			throw new BadRequestException("Role selection is required for first time Google login");
		}
		return requireAllowedRole(role);
	}

	private void ensureGoogleAccount(User user) {
		if (user.getAuthProvider() != AuthProvider.GOOGLE) {
			throw new ForbiddenException("Email is already registered using a different authentication method");
		}
	}

	private Jwt decodeIdToken(String idToken) {
		if (!StringUtils.hasText(idToken)) {
			throw new BadRequestException("Google ID token is required");
		}
		try {
			return googleIdTokenDecoder.decode(idToken);
		} catch (JwtException | OAuth2AuthenticationException ex) {
			throw new BadRequestException("Invalid Google ID token");
		}
	}

	private RoleType parseRole(String rawRole) {
		if (!StringUtils.hasText(rawRole)) {
			return null;
		}
		try {
			RoleType parsed = RoleType.valueOf(rawRole.trim().toUpperCase());
			if (!ALLOWED_REGISTRATION_ROLES.contains(parsed)) {
				throw new BadRequestException("Invalid role selection for Google login");
			}
			return parsed;
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException("Invalid role selection for Google login");
		}
	}
}
