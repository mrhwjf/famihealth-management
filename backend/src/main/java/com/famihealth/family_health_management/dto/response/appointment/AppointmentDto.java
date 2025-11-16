package com.famihealth.family_health_management.dto.response.appointment;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.famihealth.family_health_management.enums.AppointmentStatus;

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
	private Integer issuerId;
	private Integer patientId;
	private Integer doctorId;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime appointmentDatetime;
	private String location;
	private AppointmentStatus status;
	private String notes;
}
