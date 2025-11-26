package com.famihealth.family_health_management.service;

import com.famihealth.family_health_management.dto.request.oauth.GoogleOAuthRequest;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;

import org.springframework.security.oauth2.core.oidc.user.OidcUser;

public interface OAuthService {

	AuthResponse handleGoogleLogin(GoogleOAuthRequest request);

	AuthResponse handleGoogleLogin(OidcUser oidcUser, String chosenRoleRaw);
}
