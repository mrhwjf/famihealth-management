package com.famihealth.family_health_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.famihealth.family_health_management.dto.request.appointment.AppointmentCreateRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentMedicalNotesUpdateRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentUpdateRequest;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.dto.response.appointment.AppointmentDto;
import com.famihealth.family_health_management.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Validated
public class AppointmentController {

	private static final String SESSION_HEADER = "X-Session-Id";

	private final AppointmentService appointmentService;

	@PostMapping("/appointments")
	public ResponseEntity<ApiResponse<AppointmentDto>> createAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@Valid @RequestBody AppointmentCreateRequest request) {
		AppointmentDto appointment = appointmentService.createAppointment(sessionId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Appointment created", appointment));
	}

	@GetMapping("/appointments/{appointmentId}")
	public ResponseEntity<ApiResponse<AppointmentDto>> getAppointmentById(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		AppointmentDto appointment = appointmentService.getAppointmentById(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("OK", appointment));
	}

	@GetMapping("/appointments")
	public ResponseEntity<ApiResponse<List<AppointmentDto>>> getAppointmentsByPatient(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@RequestParam(name = "patientId") Integer patientId) {
		List<AppointmentDto> appointments = appointmentService.getAppointmentsByPatient(sessionId, patientId);
		return ResponseEntity.ok(ApiResponse.success("OK", appointments));
	}

	@PutMapping("/appointments/{appointmentId}")
	public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId,
			@Valid @RequestBody AppointmentUpdateRequest request) {
		AppointmentDto appointment = appointmentService.updateAppointment(sessionId, appointmentId, request);
		return ResponseEntity.ok(ApiResponse.success("Appointment updated", appointment));
	}

	@DeleteMapping("/appointments/{appointmentId}")
	public ResponseEntity<ApiResponse<Void>> deleteAppointment(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		appointmentService.deleteAppointment(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("Appointment deleted", null));
	}

	@PostMapping("/appointments/{appointmentId}/complete")
	public ResponseEntity<ApiResponse<AppointmentDto>> markAppointmentCompleted(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId) {
		AppointmentDto appointment = appointmentService.markAppointmentCompleted(sessionId, appointmentId);
		return ResponseEntity.ok(ApiResponse.success("Appointment completed", appointment));
	}

	@PatchMapping("/appointments/{appointmentId}/medical-notes")
	public ResponseEntity<ApiResponse<AppointmentDto>> updateMedicalNotes(
			@RequestHeader(name = SESSION_HEADER) String sessionId,
			@PathVariable Integer appointmentId,
			@Valid @RequestBody AppointmentMedicalNotesUpdateRequest request) {
		AppointmentDto appointment = appointmentService.updateMedicalNotes(sessionId, appointmentId, request);
		return ResponseEntity.ok(ApiResponse.success("Medical notes updated", appointment));
	}
}
