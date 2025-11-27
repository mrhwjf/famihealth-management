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

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
@Validated
public class AppointmentController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final AppointmentService appointmentService;

	@PostMapping
	public ResponseEntity<ApiResponse<AppointmentDto>> createAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @RequestBody AppointmentCreateRequest request) {
		AppointmentDto appointment = appointmentService.createAppointment(sessionId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Appointment created", appointment));
	}

	@GetMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<AppointmentDto>> getAppointmentById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		AppointmentDto appointment = appointmentService.getAppointmentById(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("OK", appointment));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PageResponse<AppointmentDto>>> getAppointments(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @ModelAttribute @ParameterObject AppointmentFilterRequest filter,
			@PageableDefault(size = 20, page = 0) Pageable pageable) {
		PageResponse<AppointmentDto> appointments = appointmentService.getAppointments(sessionId, filter, pageable);
		return ResponseEntity.ok(ApiResponse.success("OK", appointments));
	}

	@PutMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId,
			@Valid @RequestBody AppointmentUpdateRequest request) {
		AppointmentDto appointment = appointmentService.updateAppointment(sessionId, appointmentId, request);
		return ResponseEntity.ok(ApiResponse.success("Appointment updated", appointment));
	}

	@DeleteMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<Void>> deleteAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		appointmentService.deleteAppointment(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("Appointment deleted", null));
	}

	@PostMapping("/{appointmentId}/complete")
	public ResponseEntity<ApiResponse<AppointmentDto>> markAppointmentCompleted(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		AppointmentDto appointment = appointmentService.markAppointmentCompleted(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("Appointment completed", appointment));
	}

	@GetMapping("/form-data")
	public ResponseEntity<ApiResponse<AppointmentFormDto>> getAppointmentFormData(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		AppointmentFormDto formData = appointmentService.getAppointmentCreateFormData(sessionId);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("/{appointmentId}/form-data")
	public ResponseEntity<ApiResponse<AppointmentFormDto>> getAppointmentEditFormData(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		AppointmentFormDto formData = appointmentService.getAppointmentEditFormData(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("OK", formData));
	}

	@GetMapping("filter-options")
	public ResponseEntity<ApiResponse<FilterOptionDto>> getAppointmentFilterOptions(
			@RequestHeader(name = SESSION_HEADER) String sessionId) {
		FilterOptionDto filter = appointmentService.getAppointmentFilterOptions(sessionId);
		return ResponseEntity.ok(ApiResponse.success("OK", filter));
	}
}
