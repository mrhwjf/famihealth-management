package com.famihealth.family_health_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.famihealth.family_health_management.dto.request.allergy.AllergyCreateRequest;
import com.famihealth.family_health_management.dto.request.allergy.AllergyUpdateRequest;
import com.famihealth.family_health_management.dto.response.allergy.AllergyDto;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.service.AllergyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Validated
@Tag(name = "Quản lý dị ứng", description = "API quản lý thông tin dị ứng của các thành viên trong gia đình")
public class AllergyController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final AllergyService allergyService;

	@PostMapping("/family-members/{memberId}/allergies")
	@Operation(summary = "Tạo dị ứng cho thành viên", description = "Thêm mới thông tin dị ứng cho một thành viên gia đình sau khi xác thực phiên người dùng.")
	public ResponseEntity<ApiResponse<AllergyDto>> createAllergy(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer memberId,
			@Valid @RequestBody AllergyCreateRequest request) {
		AllergyDto allergy = allergyService.createAllergy(sessionId, memberId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Allergy created", allergy));
	}

	@PutMapping("/allergies/{allergyId}")
	@Operation(summary = "Cập nhật dị ứng", description = "Điều chỉnh thông tin dị ứng dựa trên mã định danh và quyền của người dùng trong phiên.")
	public ResponseEntity<ApiResponse<AllergyDto>> updateAllergy(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer allergyId,
			@Valid @RequestBody AllergyUpdateRequest request) {
		AllergyDto allergy = allergyService.updateAllergy(sessionId, allergyId, request);
		return ResponseEntity.ok(ApiResponse.success("Allergy updated", allergy));
	}

	@DeleteMapping("/allergies/{allergyId}")
	@Operation(summary = "Xóa dị ứng", description = "Loại bỏ thông tin dị ứng cụ thể của thành viên gia đình khỏi hồ sơ sức khỏe.")
	public ResponseEntity<ApiResponse<Void>> deleteAllergy(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer allergyId) {
		allergyService.deleteAllergy(sessionId, allergyId);
		return ResponseEntity.ok(ApiResponse.success("Allergy deleted", null));
	}

	@GetMapping("/allergies/{allergyId}")
	@Operation(summary = "Xem chi tiết dị ứng", description = "Lấy dữ liệu chi tiết của một dị ứng theo ID sau khi xác thực quyền truy cập bằng mã phiên.")
	public ResponseEntity<ApiResponse<AllergyDto>> getAllergyById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer allergyId) {
		AllergyDto allergy = allergyService.getAllergyById(sessionId, allergyId);
		return ResponseEntity.ok(ApiResponse.success("OK", allergy));
	}

	@GetMapping("/family-members/{memberId}/allergies")
	@Operation(summary = "Liệt kê dị ứng của thành viên", description = "Truy xuất danh sách đầy đủ các dị ứng của một thành viên gia đình dựa trên mã phiên đăng nhập.")
	public ResponseEntity<ApiResponse<List<AllergyDto>>> getAllergiesByMember(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer memberId) {
		List<AllergyDto> allergies = allergyService.getAllergiesByMemberId(sessionId, memberId);
		return ResponseEntity.ok(ApiResponse.success("OK", allergies));
	}

	@GetMapping("/families/{familyId}/allergies")
	@Operation(summary = "Liệt kê dị ứng của gia đình", description = "Truy xuất danh sách đầy đủ các dị ứng của tất cả thành viên trong một gia đình dựa trên mã phiên đăng nhập.")
	public ResponseEntity<ApiResponse<List<AllergyDto>>> getAllergiesByFamily(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer familyId) {
		List<AllergyDto> allergies = allergyService.getAllergiesByFamilyId(sessionId, familyId);
		return ResponseEntity.ok(ApiResponse.success("OK", allergies));
	}
}
