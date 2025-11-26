package com.famihealth.family_health_management.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.service.OAuthService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

	private static final Logger log = LoggerFactory.getLogger(GoogleOAuth2SuccessHandler.class);

	private final OAuthService oAuthService;
	private final ObjectMapper objectMapper;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		if (!(authentication.getPrincipal() instanceof OidcUser oidcUser)) {
			writeError(response, HttpServletResponse.SC_BAD_REQUEST,
					"Unsupported authentication principal for Google login");
			return;
		}

		String chosenRole = extractRole(request);
		try {
			AuthResponse authResponse = oAuthService.handleGoogleLogin(oidcUser, chosenRole);
			writeSuccess(response, authResponse);
		} catch (BadRequestException ex) {
			writeError(response, HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
		} catch (ForbiddenException ex) {
			writeError(response, HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
		} catch (RuntimeException ex) {
			log.error("Unexpected error during Google OAuth2 login", ex);
			writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unable to complete Google login");
		}
	}

	private void writeSuccess(HttpServletResponse response, AuthResponse authResponse) throws IOException {
		ApiResponse<AuthResponse> payload = ApiResponse.success("Google login successful", authResponse);
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding(StandardCharsets.UTF_8.name());
		response.getWriter().write(objectMapper.writeValueAsString(payload));
		response.getWriter().flush();
	}

	private void writeError(HttpServletResponse response, int status, String message) throws IOException {
		ApiResponse<Void> payload = ApiResponse.failure(message);
		response.setStatus(status);
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding(StandardCharsets.UTF_8.name());
		response.getWriter().write(objectMapper.writeValueAsString(payload));
		response.getWriter().flush();
	}

	private String extractRole(HttpServletRequest request) {
		String directRole = request.getParameter("role");
		if (StringUtils.hasText(directRole)) {
			return directRole;
		}

		String state = request.getParameter("state");
		if (!StringUtils.hasText(state)) {
			return null;
		}
		try {
			MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUriString("?" + state)
					.build()
					.getQueryParams();
			String roleFromState = queryParams.getFirst("role");
			return StringUtils.hasText(roleFromState) ? roleFromState : null;
		} catch (IllegalArgumentException ex) {
			log.warn("Unable to parse OAuth2 state parameter: {}", state, ex);
			return null;
		}
	}
}
