package com.famihealth.family_health_management.service;

import java.util.List;

import com.famihealth.family_health_management.dto.request.appointment.AppointmentCreateRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentMedicalNotesUpdateRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentUpdateRequest;
import com.famihealth.family_health_management.dto.response.appointment.AppointmentDto;

public interface AppointmentService {

	AppointmentDto createAppointment(String sessionId, AppointmentCreateRequest request);

	AppointmentDto getAppointmentById(String sessionId, Integer appointmentId);

	List<AppointmentDto> getAppointmentsByPatient(String sessionId, Integer patientId);

	AppointmentDto updateAppointment(String sessionId, Integer appointmentId, AppointmentUpdateRequest request);

	void deleteAppointment(String sessionId, Integer appointmentId);

	AppointmentDto markAppointmentCompleted(String sessionId, Integer appointmentId);

	AppointmentDto updateMedicalNotes(String sessionId, Integer appointmentId,
			AppointmentMedicalNotesUpdateRequest request);
}
