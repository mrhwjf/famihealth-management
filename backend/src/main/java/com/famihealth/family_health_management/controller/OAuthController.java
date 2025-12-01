package com.famihealth.family_health_management.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.oauth.GoogleOAuthRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;
import com.famihealth.family_health_management.service.OAuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/oauth")
@RequiredArgsConstructor
@Validated
public class OAuthController {

	private final OAuthService oAuthService;

	@PostMapping("/google")
	public ResponseEntity<ApiResponse<AuthResponse>> handleGoogleLogin(@Valid @RequestBody GoogleOAuthRequest request) {
		AuthResponse response = oAuthService.handleGoogleLogin(request);
		return ResponseEntity.status(HttpStatus.OK)
				.body(ApiResponse.success("Google login successful", response));
	}
}
