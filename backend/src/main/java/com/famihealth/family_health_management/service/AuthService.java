package com.famihealth.family_health_management.service;

import com.famihealth.family_health_management.dto.request.auth.LoginRequest;
import com.famihealth.family_health_management.dto.request.auth.RegisterRequest;
import com.famihealth.family_health_management.dto.request.auth.ResetPasswordRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.response.auth.AuthResponse;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;

public interface AuthService {

	AuthResponse login(LoginRequest req);

	void logout(String sessionId);

	UserDetailDto registerAdmin(RegisterRequest req);

	UserDetailDto registerFamily(RegisterRequest req);

	UserDetailDto registerDoctor(DoctorCreateRequest req);

	String requestPasswordReset(String email);

	void resetPassword(ResetPasswordRequest req);
}
