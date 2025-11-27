package com.famihealth.family_health_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.family_invite_code.FamilyInviteCodeDto;
import com.famihealth.family_health_management.service.FamilyInviteCodeService;

import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/families/{familyId}/invite-code")
@RequiredArgsConstructor
@Validated
@Tag(name = "Mã mời gia đình", description = "API quản lý mã mời tham gia gia đình và trạng thái kích hoạt")
public class FamilyInviteCodeController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final FamilyInviteCodeService familyInviteCodeService;

	@GetMapping
	@Operation(summary = "Lấy mã mời hiện tại", description = "Truy xuất mã mời đang có hiệu lực của gia đình dựa trên mã phiên của người dùng.")
	public ResponseEntity<ApiResponse<FamilyInviteCodeDto>> getInviteCode(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		FamilyInviteCodeDto inviteCode = familyInviteCodeService.getInviteCodeByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("OK", inviteCode));
	}

	@PostMapping("/regenerate")
	@Operation(summary = "Tạo lại mã mời", description = "Sinh mã mời mới cho gia đình và vô hiệu hóa mã cũ nếu tồn tại.")
	public ResponseEntity<ApiResponse<FamilyInviteCodeDto>> regenerate(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		FamilyInviteCodeDto inviteCode = familyInviteCodeService.regenerateInviteCodeByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("Invite code regenerated", inviteCode));
	}

	@PostMapping("/deactivate")
	@Operation(summary = "Hủy kích hoạt mã mời", description = "Ngừng sử dụng mã mời hiện tại để ngăn thành viên mới tham gia.")
	public ResponseEntity<ApiResponse<Void>> deactivate(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		familyInviteCodeService.deactivateInviteCodeByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("Invite code deactivated", null));
	}

	@PostMapping("/activate")
	@Operation(summary = "Kích hoạt lại mã mời", description = "Cho phép mã mời của gia đình hoạt động trở lại để tiếp nhận thành viên mới.")
	public ResponseEntity<ApiResponse<Void>> activate(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		familyInviteCodeService.activateInviteCodeByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("Invite code activated", null));
	}

	@GetMapping("/validate")
	@Operation(summary = "Kiểm tra mã mời", description = "Xác minh mã mời do người dùng cung cấp có hợp lệ cho gia đình hay không.")
	public ResponseEntity<ApiResponse<Boolean>> validate(
			@PathVariable Integer familyId,
			@RequestParam String code) {
		boolean valid = familyInviteCodeService.validateInviteCode(familyId, code);
		return ResponseEntity.ok(ApiResponse.success("OK", valid));
	}
}
