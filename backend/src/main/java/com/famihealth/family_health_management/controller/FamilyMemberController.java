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
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberDetailDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberFormDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberSummaryDto;
import com.famihealth.family_health_management.service.FamilyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/families/{familyId}/members")
@RequiredArgsConstructor
@Validated
@Tag(name = "Thành viên gia đình", description = "API quản lý hồ sơ thành viên và liên kết quyền truy cập với người dùng, bác sĩ")
public class FamilyMemberController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final FamilyService familyService;

	@PostMapping
	@Operation(summary = "Tạo thành viên gia đình", description = "Thêm mới một thành viên vào gia đình và thiết lập thông tin cơ bản.")
	public ResponseEntity<ApiResponse<FamilyMemberSummaryDto>> createMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@Valid @RequestBody FamilyMemberCreateRequest request) {
		FamilyMemberSummaryDto member = familyService.createMember(sessionId, familyId, request);
		return ResponseEntity.ok(ApiResponse.success("Family member created", member));
	}

	@PutMapping("{memberId}")
	@Operation(summary = "Cập nhật thành viên gia đình", description = "Điều chỉnh thông tin chi tiết của thành viên dựa trên mã thành viên.")
	public ResponseEntity<ApiResponse<FamilyMemberSummaryDto>> updateMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberUpdateRequest request) {
		FamilyMemberSummaryDto member = familyService.updateMemberById(sessionId, familyId, memberId, request);
		return ResponseEntity.ok(ApiResponse.success("Family member updated", member));
	}

	@DeleteMapping("{memberId}")
	@Operation(summary = "Xóa thành viên gia đình", description = "Loại bỏ thành viên khỏi gia đình và thu hồi quyền liên kết.")
	public ResponseEntity<ApiResponse<Void>> deleteMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId) {
		familyService.deleteMemberById(sessionId, familyId, memberId);
		return ResponseEntity.ok(ApiResponse.success("Family member deleted", null));
	}

	@GetMapping("{memberId}")
	@Operation(summary = "Xem chi tiết thành viên", description = "Truy xuất thông tin chi tiết của một thành viên trong gia đình.")
	public ResponseEntity<ApiResponse<FamilyMemberDetailDto>> getMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId) {
		FamilyMemberDetailDto member = familyService.getMemberById(sessionId, familyId, memberId);
		return ResponseEntity.ok(ApiResponse.success("OK", member));
	}

	@PostMapping("{memberId}/link-user")
	@Operation(summary = "Liên kết thành viên với người dùng", description = "Gán một tài khoản người dùng cụ thể làm người đại diện cho thành viên.")
	public ResponseEntity<ApiResponse<Void>> linkUser(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberLinkUserRequest request) {
		familyService.linkUserToMember(sessionId, familyId, memberId, request.getUserId());
		return ResponseEntity.ok(ApiResponse.success("User linked to member", null));
	}

	@DeleteMapping("{memberId}/unlink-user")
	@Operation(summary = "Hủy liên kết người dùng", description = "Xóa mối liên kết giữa thành viên và tài khoản người dùng tương ứng.")
	public ResponseEntity<ApiResponse<Void>> unlinkUser(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberLinkUserRequest request) {
		familyService.unlinkUserFromMember(sessionId, familyId, memberId, request.getUserId());
		return ResponseEntity.ok(ApiResponse.success("User unlinked from member", null));
	}

	@PostMapping("{memberId}/link-doctor")
	@Operation(summary = "Liên kết bác sĩ theo dõi", description = "Gán một bác sĩ phụ trách theo dõi hồ sơ sức khỏe của thành viên.")
	public ResponseEntity<ApiResponse<Void>> linkDoctor(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberLinkDoctorRequest request) {
		familyService.linkDoctorToMember(sessionId, familyId, memberId, request.getDoctorId());
		return ResponseEntity.ok(ApiResponse.success("Doctor linked to member", null));
	}

	@DeleteMapping("{memberId}/unlink-doctor")
	@Operation(summary = "Hủy liên kết bác sĩ", description = "Loại bỏ bác sĩ khỏi danh sách theo dõi của thành viên.")
	public ResponseEntity<ApiResponse<Void>> unlinkDoctor(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId,
			@Valid @RequestBody FamilyMemberLinkDoctorRequest request) {
		familyService.unlinkDoctorFromMember(sessionId, familyId, memberId, request.getDoctorId());
		return ResponseEntity.ok(ApiResponse.success("Doctor unlinked from member", null));
	}

	@GetMapping
	@Operation(summary = "Danh sách thành viên gia đình", description = "Liệt kê tất cả thành viên thuộc một gia đình sau khi xác thực phiên.")
	public ResponseEntity<ApiResponse<List<FamilyMemberSummaryDto>>> getAll(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		List<FamilyMemberSummaryDto> members = familyService.getAllMembersInFamily(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("OK", members));
	}

	@GetMapping("/form-data")
	@Operation(summary = "Dữ liệu biểu mẫu thành viên gia đình", description = "Lấy dữ liệu cần thiết để điền biểu mẫu khi tạo hoặc chỉnh sửa thành viên gia đình.")
	public ResponseEntity<ApiResponse<FamilyMemberFormDto>> getMemberFormData(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId) {
		FamilyMemberFormDto formData = familyService.getMemberEditFormData(sessionId, familyId, memberId);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("/{memberId}/form-data")
	@Operation(summary = "Dữ liệu biểu mẫu chỉnh sửa thành viên gia đình", description = "Lấy dữ liệu cần thiết để điền biểu mẫu khi tạo hoặc chỉnh sửa thành viên gia đình.")
	public ResponseEntity<ApiResponse<FamilyMemberFormDto>> getMemberEditFormData(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer memberId) {
		FamilyMemberFormDto formData = familyService.getMemberEditFormData(sessionId, familyId, memberId);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}
}
