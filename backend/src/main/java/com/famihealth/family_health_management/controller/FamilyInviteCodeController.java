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

@RestController
@RequestMapping("/api/v1/families/{familyId}/invite-code")
@RequiredArgsConstructor
@Validated
public class FamilyInviteCodeController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final FamilyInviteCodeService familyInviteCodeService;

	@GetMapping
	public ResponseEntity<ApiResponse<FamilyInviteCodeDto>> getInviteCode(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		FamilyInviteCodeDto inviteCode = familyInviteCodeService.getInviteCodeByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("OK", inviteCode));
	}

	@PostMapping("/regenerate")
	public ResponseEntity<ApiResponse<FamilyInviteCodeDto>> regenerate(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		FamilyInviteCodeDto inviteCode = familyInviteCodeService.regenerateInviteCodeByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("Invite code regenerated", inviteCode));
	}

	@PostMapping("/deactivate")
	public ResponseEntity<ApiResponse<Void>> deactivate(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		familyInviteCodeService.deactivateInviteCodeByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("Invite code deactivated", null));
	}

	@PostMapping("/activate")
	public ResponseEntity<ApiResponse<Void>> activate(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		familyInviteCodeService.activateInviteCodeByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("Invite code activated", null));
	}

	@GetMapping("/validate")
	public ResponseEntity<ApiResponse<Boolean>> validate(
			@PathVariable Integer familyId,
			@RequestParam String code) {
		boolean valid = familyInviteCodeService.validateInviteCode(familyId, code);
		return ResponseEntity.ok(ApiResponse.success("OK", valid));
	}
}
