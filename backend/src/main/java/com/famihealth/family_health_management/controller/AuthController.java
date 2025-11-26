package com.famihealth.family_health_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.auth.LoginRequest;
import com.famihealth.family_health_management.dto.request.auth.PasswordResetConfirmRequest;
import com.famihealth.family_health_management.dto.request.auth.PasswordResetRequest;
import com.famihealth.family_health_management.dto.request.auth.RegisterRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;
import com.famihealth.family_health_management.service.AuthService;

import jakarta.validation.Valid;
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
	public ResponseEntity<ApiResponse<AuthResponse>> registerAdmin(@Valid @RequestBody RegisterRequest request) {
		AuthResponse response = authService.registerAdmin(request);
		return ResponseEntity.ok(ApiResponse.success("Admin registered", response));
	}

	@PostMapping("/register/family")
	public ResponseEntity<ApiResponse<AuthResponse>> registerFamily(@Valid @RequestBody RegisterRequest request) {
		AuthResponse response = authService.registerFamily(request);
		return ResponseEntity.ok(ApiResponse.success("Family account registered", response));
	}

	@PostMapping("/register/doctor")
	public ResponseEntity<ApiResponse<AuthResponse>> registerDoctor(@Valid @RequestBody DoctorCreateRequest request) {
		AuthResponse response = authService.registerDoctor(request);
		return ResponseEntity.ok(ApiResponse.success("Doctor registered", response));
	}

	@PostMapping("/request-password-reset")
	public ResponseEntity<ApiResponse<Void>> requestPasswordReset(
			@Valid @RequestBody PasswordResetRequest request) {
		authService.requestPasswordReset(request);
		return ResponseEntity.ok(ApiResponse.success("Password reset OTP sent", null));
	}

	@PostMapping("/reset-password")
	public ResponseEntity<ApiResponse<Void>> resetPassword(
			@Valid @RequestBody PasswordResetConfirmRequest request) {
		authService.verifyOtpAndResetPassword(request);
		return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
	}
}
