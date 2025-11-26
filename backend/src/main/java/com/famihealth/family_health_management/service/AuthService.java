package com.famihealth.family_health_management.service;

import com.famihealth.family_health_management.dto.request.auth.LoginRequest;
import com.famihealth.family_health_management.dto.request.auth.PasswordResetConfirmRequest;
import com.famihealth.family_health_management.dto.request.auth.PasswordResetRequest;
import com.famihealth.family_health_management.dto.request.auth.RegisterRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;

public interface AuthService {

	AuthResponse login(LoginRequest req);

	void logout(String sessionId);

	AuthResponse registerAdmin(RegisterRequest req);

	AuthResponse registerFamily(RegisterRequest req);

	AuthResponse registerDoctor(DoctorCreateRequest req);

	void requestPasswordReset(PasswordResetRequest request);

	void verifyOtpAndResetPassword(PasswordResetConfirmRequest request);
}
