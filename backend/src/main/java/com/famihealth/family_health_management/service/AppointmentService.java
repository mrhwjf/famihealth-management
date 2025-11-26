package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.appointment.AppointmentCreateRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentFilterRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentUpdateRequest;
import com.famihealth.family_health_management.dto.response.appointment.AppointmentDto;
import com.famihealth.family_health_management.dto.response.common.PageResponse;

public interface AppointmentService {

	AppointmentDto createAppointment(String sessionId, AppointmentCreateRequest request);

	AppointmentDto getAppointmentById(String sessionId, Integer appointmentId);

	PageResponse<AppointmentDto> getAppointments(String sessionId, AppointmentFilterRequest filterRequest,
			Pageable pageable);

	AppointmentDto updateAppointment(String sessionId, Integer appointmentId, AppointmentUpdateRequest request);

	void deleteAppointment(String sessionId, Integer appointmentId);

	AppointmentDto markAppointmentCompleted(String sessionId, Integer appointmentId);

}
