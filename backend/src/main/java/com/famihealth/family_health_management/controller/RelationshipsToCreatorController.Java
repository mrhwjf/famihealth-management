package com.famihealth.family_health_management.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.famihealth.family_health_management.dto.request.relationships_to_creator.RelationshipsToCreatorCreateRequest;
import com.famihealth.family_health_management.dto.request.relationships_to_creator.RelationshipsToCreatorUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.relationships_to_creator.RelationshipsToCreatorDto;
import com.famihealth.family_health_management.service.RelationshipsToCreatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/api/v1/relationships-to-creator")
@Validated
@RequiredArgsConstructor
@Tag(name = "Quan hệ với người tạo", description = "API quản lý danh mục mối quan hệ giữa các thành viên và người tạo hồ sơ")
public class RelationshipsToCreatorController {
	private final RelationshipsToCreatorService service;

	@PostMapping
	@Operation(summary = "Tạo mối quan hệ", description = "Thêm mới một loại quan hệ giữa thành viên và người tạo hồ sơ.")
	public ResponseEntity<ApiResponse<RelationshipsToCreatorDto>> create(
			@Valid @RequestBody RelationshipsToCreatorCreateRequest req) {

		return ResponseEntity.ok(ApiResponse.success("Relationship to creator created", service.create(req)));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Cập nhật mối quan hệ", description = "Điều chỉnh thông tin tên gọi của mối quan hệ dựa trên ID.")
	public ResponseEntity<ApiResponse<RelationshipsToCreatorDto>> updateById(@PathVariable Integer id,
			@Valid @RequestBody RelationshipsToCreatorUpdateRequest req) {

		return ResponseEntity.ok(ApiResponse.success("Relationship to creator updated", service.updateById(id, req)));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Xóa mối quan hệ", description = "Loại bỏ một mối quan hệ khỏi danh mục quản trị.")
	public ResponseEntity<ApiResponse<Void>> deleteById(@PathVariable Integer id) {
		service.deleteById(id);
		return ResponseEntity.ok(ApiResponse.success("Relationship to creator deleted", null));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Xem chi tiết mối quan hệ", description = "Tra cứu thông tin chi tiết của mối quan hệ theo mã định danh.")
	public ResponseEntity<ApiResponse<RelationshipsToCreatorDto>> getById(@PathVariable Integer id) {
		return ResponseEntity.ok(ApiResponse.success("OK", service.getById(id)));
	}

	@GetMapping
	@Operation(summary = "Danh sách mối quan hệ", description = "Phân trang và lọc các mối quan hệ theo tên để phục vụ quản trị.")
	public ResponseEntity<ApiResponse<PageResponse<RelationshipsToCreatorDto>>> getAll(
			@RequestParam(name = "name", required = false) String name,
			@ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {
				
		return ResponseEntity.ok(
				ApiResponse.success("OK", service.getAll(name, pageable)));
	}
}
