package com.famihealth.family_health_management.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.auth.LoginRequest;
import com.famihealth.family_health_management.dto.request.auth.RegisterRequest;
import com.famihealth.family_health_management.dto.request.auth.ResetPasswordRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;
import com.famihealth.family_health_management.service.AuthService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
		AuthResponse response = authService.login(request);
		return ResponseEntity.ok(ApiResponse.success("Login successful", response));
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<Void>> logout(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		authService.logout(sessionId);
		return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
	}

	@PostMapping("/register/admin")
	public ResponseEntity<ApiResponse<UserDetailDto>> registerAdmin(@Valid @RequestBody RegisterRequest request) {
		UserDetailDto user = authService.registerAdmin(request);
		return ResponseEntity.ok(ApiResponse.success("Admin registered", user));
	}

	@PostMapping("/register/family")
	public ResponseEntity<ApiResponse<UserDetailDto>> registerFamily(@Valid @RequestBody RegisterRequest request) {
		UserDetailDto user = authService.registerFamily(request);
		return ResponseEntity.ok(ApiResponse.success("Family account registered", user));
	}

	@PostMapping("/register/doctor")
	public ResponseEntity<ApiResponse<UserDetailDto>> registerDoctor(@Valid @RequestBody DoctorCreateRequest request) {
		UserDetailDto user = authService.registerDoctor(request);
		return ResponseEntity.ok(ApiResponse.success("Doctor registered", user));
	}

	@PostMapping("/request-password-reset")
	public ResponseEntity<ApiResponse<Map<String, String>>> requestPasswordReset(@RequestParam @Email String email) {
		String token = authService.requestPasswordReset(email);
		return ResponseEntity.ok(ApiResponse.success("If the email exists, a reset token has been generated",
				token == null ? null : Map.of("token", token)));
	}

	@PostMapping("/reset-password")
	public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		authService.resetPassword(request);
		return ResponseEntity.ok(ApiResponse.success("Password reset successful", null));
	}
}
