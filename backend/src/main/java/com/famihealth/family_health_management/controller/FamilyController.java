package com.famihealth.family_health_management.controller;

import java.util.List;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.family.FamilyCreateRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyFilterRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.family.FamilyDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberSummaryDto;
import com.famihealth.family_health_management.dto.response.member_access.MemberAccessDto;
import com.famihealth.family_health_management.service.FamilyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/families")
@RequiredArgsConstructor
@Validated
@Tag(name = "Quản lý gia đình", description = "API quản lý hồ sơ gia đình và phân quyền truy cập thành viên")
public class FamilyController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final FamilyService familyService;

	@PostMapping
	@Operation(summary = "Tạo gia đình", description = "Khởi tạo hồ sơ gia đình mới và gán chủ sở hữu dựa trên mã phiên.")
	public ResponseEntity<ApiResponse<FamilyDto>> create(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @RequestBody FamilyCreateRequest request) {
		FamilyDto result = familyService.create(sessionId, request);
		return ResponseEntity.ok(ApiResponse.success("Family created", result));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Cập nhật gia đình", description = "Chỉnh sửa thông tin chi tiết của gia đình dựa trên mã gia đình.")
	public ResponseEntity<ApiResponse<FamilyDto>> update(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id,
			@Valid @RequestBody FamilyUpdateRequest request) {
		FamilyDto result = familyService.updateById(sessionId, id, request);
		return ResponseEntity.ok(ApiResponse.success("Family updated", result));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Xem chi tiết gia đình", description = "Lấy thông tin hồ sơ của một gia đình cụ thể sau khi xác thực phiên.")
	public ResponseEntity<ApiResponse<FamilyDto>> getById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		FamilyDto result = familyService.getById(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("OK", result));
	}

	@GetMapping("/me")
	@Operation(summary = "Xem chi tiết gia đình của tôi", description = "Lấy thông tin hồ sơ của gia đình hiện tại của người dùng dựa trên phiên đã xác thực.")
	public ResponseEntity<ApiResponse<FamilyDto>> getMyFamily(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		FamilyDto result = familyService.getMyFamily(sessionId);
		return ResponseEntity.ok(ApiResponse.success("OK", result));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Xóa gia đình", description = "Loại bỏ một gia đình khỏi hệ thống và thu hồi quyền truy cập liên quan.")
	public ResponseEntity<ApiResponse<Void>> delete(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer id) {
		familyService.deleteById(sessionId, id);
		return ResponseEntity.ok(ApiResponse.success("Family deleted", null));
	}

	@GetMapping
	@Operation(summary = "Tìm kiếm gia đình", description = "Lọc và phân trang danh sách gia đình theo tiêu chí được cung cấp.")
	public ResponseEntity<ApiResponse<PageResponse<FamilyDto>>> getAll(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @ModelAttribute @ParameterObject FamilyFilterRequest filter,
			@ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {
		PageResponse<FamilyDto> page = familyService.getAll(sessionId, filter, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", page));
	}

	@PostMapping("/{familyId}/access/users/{userId}")
	@Operation(summary = "Thêm người dùng vào gia đình", description = "Cấp quyền để một người dùng tham gia gia đình và truy cập dữ liệu liên quan.")
	public ResponseEntity<ApiResponse<Void>> addUser(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer userId) {
		familyService.addUserToFamily(sessionId, familyId, userId);
		return ResponseEntity.ok(ApiResponse.success("User added to family", null));
	}

	@DeleteMapping("/{familyId}/access/users/{userId}")
	@Operation(summary = "Xóa người dùng khỏi gia đình", description = "Thu hồi quyền truy cập của một người dùng đối với gia đình cụ thể.")
	public ResponseEntity<ApiResponse<Void>> removeUser(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId,
			@PathVariable Integer userId) {
		familyService.removeUserFromFamily(sessionId, familyId, userId);
		return ResponseEntity.ok(ApiResponse.success("User removed from family", null));
	}

	@GetMapping("/{familyId}/access/members")
	@Operation(summary = "Danh sách quyền truy cập thành viên", description = "Liệt kê các thành viên và quyền truy cập của họ trong một gia đình.")
	public ResponseEntity<ApiResponse<List<MemberAccessDto>>> getMembersAccessList(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		List<MemberAccessDto> accessList = familyService.getMembersAccessList(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("OK", accessList));
	}

	@GetMapping("/me/members")
	@Operation(summary = "Danh sách thành viên trong gia đình của tôi", description = "Liệt kê tất cả các thành viên trong gia đình hiện tại của người dùng dựa trên phiên đã xác thực.")
	public ResponseEntity<ApiResponse<List<FamilyMemberSummaryDto>>> getAllMembersInMyFamily(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		List<FamilyMemberSummaryDto> members = familyService.getAllMembersInMyFamily(sessionId);
		return ResponseEntity.ok(ApiResponse.success("OK", members));
	}
}