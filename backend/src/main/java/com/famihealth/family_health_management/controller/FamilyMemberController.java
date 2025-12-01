package com.famihealth.family_health_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberCreateRequest;
import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberLinkDoctorRequest;
import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberLinkUserRequest;
import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberSummaryDto;
import com.famihealth.family_health_management.service.FamilyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/families/{familyId}/members")
@RequiredArgsConstructor
@Validated
public class FamilyMemberController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final FamilyService familyService;

	@PostMapping
	public ResponseEntity<ApiResponse<FamilyMemberSummaryDto>> createMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@Valid @RequestBody FamilyMemberCreateRequest request) {
		FamilyMemberSummaryDto member = familyService.createMember(sessionId, familyId, request);
		return ResponseEntity.ok(ApiResponse.success("Family member created", member));
	}

	@PutMapping("{memberId}")
	public ResponseEntity<ApiResponse<FamilyMemberSummaryDto>> updateMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberUpdateRequest request) {
		FamilyMemberSummaryDto member = familyService.updateMemberById(sessionId, familyId, memberId, request);
		return ResponseEntity.ok(ApiResponse.success("Family member updated", member));
	}

	@DeleteMapping("{memberId}")
	public ResponseEntity<ApiResponse<Void>> deleteMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId) {
		familyService.deleteMemberById(sessionId, familyId, memberId);
		return ResponseEntity.ok(ApiResponse.success("Family member deleted", null));
	}

	@GetMapping("{memberId}")
	public ResponseEntity<ApiResponse<FamilyMemberSummaryDto>> getMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId) {
		FamilyMemberSummaryDto member = familyService.getMemberById(sessionId, familyId, memberId);
		return ResponseEntity.ok(ApiResponse.success("OK", member));
	}

	@PostMapping("{memberId}/link-user")
	public ResponseEntity<ApiResponse<Void>> linkUser(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberLinkUserRequest request) {
		familyService.linkUserToMember(sessionId, familyId, memberId, request.getUserId());
		return ResponseEntity.ok(ApiResponse.success("User linked to member", null));
	}

	@DeleteMapping("{memberId}/unlink-user")
	public ResponseEntity<ApiResponse<Void>> unlinkUser(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberLinkUserRequest request) {
		familyService.unlinkUserFromMember(sessionId, familyId, memberId, request.getUserId());
		return ResponseEntity.ok(ApiResponse.success("User unlinked from member", null));
	}

	@PostMapping("{memberId}/link-doctor")
	public ResponseEntity<ApiResponse<Void>> linkDoctor(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberLinkDoctorRequest request) {
		familyService.linkDoctorToMember(sessionId, familyId, memberId, request.getDoctorId());
		return ResponseEntity.ok(ApiResponse.success("Doctor linked to member", null));
	}

	@DeleteMapping("{memberId}/unlink-doctor")
	public ResponseEntity<ApiResponse<Void>> unlinkDoctor(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberLinkDoctorRequest request) {
		familyService.unlinkDoctorFromMember(sessionId, familyId, memberId, request.getDoctorId());
		return ResponseEntity.ok(ApiResponse.success("Doctor unlinked from member", null));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<FamilyMemberSummaryDto>>> getAll(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		List<FamilyMemberSummaryDto> members = familyService.getAllMembersInFamily(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("OK", members));
	}
}
