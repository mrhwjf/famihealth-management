package com.famihealth.family_health_management.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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

import com.famihealth.family_health_management.dto.request.appointment.AppointmentCreateRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentFilterRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.appointment.AppointmentDto;
import com.famihealth.family_health_management.dto.response.appointment.AppointmentFormDto;
import com.famihealth.family_health_management.dto.response.common.FilterOptionDto;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
@Validated
@Tag(name = "Quản lý lịch hẹn", description = "API phục vụ tạo, cập nhật, hoàn tất và tra cứu lịch hẹn khám bệnh")
public class AppointmentController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final AppointmentService appointmentService;

	@PostMapping
	@Operation(summary = "Tạo lịch hẹn mới", description = "Khởi tạo lịch hẹn khám bệnh cho người dùng dựa trên thông tin yêu cầu và mã phiên xác thực.")
	public ResponseEntity<ApiResponse<AppointmentDto>> createAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @RequestBody AppointmentCreateRequest request) {
		AppointmentDto appointment = appointmentService.createAppointment(sessionId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Appointment created", appointment));
	}

	@GetMapping("/{appointmentId}")
	@Operation(summary = "Xem chi tiết lịch hẹn", description = "Lấy thông tin chi tiết của một lịch hẹn cụ thể dựa trên ID và quyền của người dùng.")
	public ResponseEntity<ApiResponse<AppointmentDto>> getAppointmentById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		AppointmentDto appointment = appointmentService.getAppointmentById(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("OK", appointment));
	}

	@GetMapping
	@Operation(summary = "Tìm kiếm lịch hẹn", description = "Lọc và phân trang danh sách lịch hẹn dựa trên bộ tiêu chí tìm kiếm và phiên đăng nhập của người dùng.")
	public ResponseEntity<ApiResponse<PageResponse<AppointmentDto>>> getAppointments(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @ModelAttribute @ParameterObject AppointmentFilterRequest filter,
			@PageableDefault(size = 20, page = 0) Pageable pageable) {
		PageResponse<AppointmentDto> appointments = appointmentService.getAppointments(sessionId, filter, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", appointments));
	}

	@PutMapping("/{appointmentId}")
	@Operation(summary = "Cập nhật lịch hẹn", description = "Chỉnh sửa thông tin lịch hẹn đã tạo dựa trên ID và dữ liệu mới từ người dùng.")
	public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId,
			@Valid @RequestBody AppointmentUpdateRequest request) {
		AppointmentDto appointment = appointmentService.updateAppointment(sessionId, appointmentId, request);
		return ResponseEntity.ok(ApiResponse.success("Appointment updated", appointment));
	}

	@DeleteMapping("/{appointmentId}")
	@Operation(summary = "Xóa lịch hẹn", description = "Hủy bỏ một lịch hẹn dựa trên mã định danh và quyền của người dùng trong gia đình.")
	public ResponseEntity<ApiResponse<Void>> deleteAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		appointmentService.deleteAppointment(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("Appointment deleted", null));
	}

	@PostMapping("/{appointmentId}/complete")
	@Operation(summary = "Đánh dấu hoàn tất lịch hẹn", description = "Chuyển trạng thái lịch hẹn sang đã hoàn thành sau khi dịch vụ khám kết thúc.")
	public ResponseEntity<ApiResponse<AppointmentDto>> markAppointmentCompleted(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		AppointmentDto appointment = appointmentService.markAppointmentCompleted(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("Appointment completed", appointment));
	}

	@GetMapping("/form-data")
	@Operation(summary = "Lấy dữ liệu khởi tạo lịch hẹn", description = "Cung cấp danh mục lựa chọn cần thiết để người dùng tạo lịch hẹn mới.")
	public ResponseEntity<ApiResponse<AppointmentFormDto>> getAppointmentFormData(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		AppointmentFormDto formData = appointmentService.getAppointmentCreateFormData(sessionId);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("/{appointmentId}/form-data")
	@Operation(summary = "Lấy dữ liệu chỉnh sửa lịch hẹn", description = "Cung cấp thông tin tham chiếu để chỉnh sửa lịch hẹn hiện có dựa trên ID.")
	public ResponseEntity<ApiResponse<AppointmentFormDto>> getAppointmentEditFormData(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		AppointmentFormDto formData = appointmentService.getAppointmentEditFormData(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("filter-options")
	@Operation(summary = "Lấy bộ lọc lịch hẹn", description = "Lấy danh sách các tùy chọn bộ lọc được hỗ trợ khi tìm kiếm lịch hẹn.")
	public ResponseEntity<ApiResponse<FilterOptionDto>> getAppointmentFilterOptions(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		FilterOptionDto filter = appointmentService.getAppointmentFilterOptions(sessionId);
		return ResponseEntity.ok(ApiResponse.success("OK", filter));
	}
}
