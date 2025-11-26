package com.famihealth.family_health_management.dto.response.appointment;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDto {
	private Integer id;
	private String issuer;
	private String patient;
	private Integer patientId;
	private String doctor;
	private Integer doctorId;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime appointmentDatetime;
	private String location;
	private String status;
	private String notes;
	private String medicalNotes;
}
