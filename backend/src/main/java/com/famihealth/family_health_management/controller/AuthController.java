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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Validated
@Tag(name = "Xác thực người dùng", description = "API xử lý đăng nhập, đăng ký và khôi phục mật khẩu cho hệ thống FamiHealth")
public class AuthController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final AuthService authService;

	@PostMapping("/login")
	@Operation(summary = "Đăng nhập tài khoản", description = "Xác thực người dùng bằng thông tin đăng nhập và trả về dữ liệu phiên làm việc.")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
		AuthResponse response = authService.login(request);
		return ResponseEntity.ok(ApiResponse.success("Login successful", response));
	}

	@PostMapping("/logout")
	@Operation(summary = "Đăng xuất tài khoản", description = "Hủy phiên đăng nhập hiện tại dựa trên mã phiên được cung cấp trong header.")
	public ResponseEntity<ApiResponse<Void>> logout(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		authService.logout(sessionId);
		return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
	}

	@PostMapping("/register/admin")
	@Operation(summary = "Đăng ký tài khoản quản trị", description = "Tạo mới tài khoản quản trị viên với thông tin hợp lệ do hệ thống yêu cầu.")
	public ResponseEntity<ApiResponse<AuthResponse>> registerAdmin(@Valid @RequestBody RegisterRequest request) {
		AuthResponse response = authService.registerAdmin(request);
		return ResponseEntity.ok(ApiResponse.success("Admin registered", response));
	}

	@PostMapping("/register/family")
	@Operation(summary = "Đăng ký tài khoản gia đình", description = "Đăng ký người dùng thuộc nhóm gia đình để quản lý hồ sơ sức khỏe.")
	public ResponseEntity<ApiResponse<AuthResponse>> registerFamily(@Valid @RequestBody RegisterRequest request) {
		AuthResponse response = authService.registerFamily(request);
		return ResponseEntity.ok(ApiResponse.success("Family account registered", response));
	}

	@PostMapping("/register/doctor")
	@Operation(summary = "Đăng ký tài khoản bác sĩ", description = "Tạo tài khoản bác sĩ mới và ghi nhận thông tin phục vụ quá trình thẩm định.")
	public ResponseEntity<ApiResponse<AuthResponse>> registerDoctor(@Valid @RequestBody DoctorCreateRequest request) {
		AuthResponse response = authService.registerDoctor(request);
		return ResponseEntity.ok(ApiResponse.success("Doctor registered", response));
	}

	@PostMapping("/request-password-reset")
	@Operation(summary = "Gửi yêu cầu đặt lại mật khẩu", description = "Khởi tạo yêu cầu đặt lại mật khẩu và gửi mã OTP xác thực tới người dùng.")
	public ResponseEntity<ApiResponse<Void>> requestPasswordReset(
			@Valid @RequestBody PasswordResetRequest request) {
		authService.requestPasswordReset(request);
		return ResponseEntity.ok(ApiResponse.success("Password reset OTP sent", null));
	}

	@PostMapping("/reset-password")
	@Operation(summary = "Xác nhận OTP và đặt lại mật khẩu", description = "Kiểm tra mã OTP hợp lệ và cập nhật mật khẩu mới cho tài khoản người dùng.")
	public ResponseEntity<ApiResponse<Void>> resetPassword(
			@Valid @RequestBody PasswordResetConfirmRequest request) {
		authService.verifyOtpAndResetPassword(request);
		return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
	}
}
