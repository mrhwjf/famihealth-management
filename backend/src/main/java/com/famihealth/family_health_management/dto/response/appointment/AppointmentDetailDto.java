package com.famihealth.family_health_management.dto.response.appointment;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.famihealth.family_health_management.enums.AppointmentStatus;
import com.famihealth.family_health_management.dto.response.doctor_profile.DoctorProfileDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberSummaryDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDetailDto {
	private Integer id;

	private UserSummaryDto issuer;
	private FamilyMemberSummaryDto patient;
	private DoctorProfileDto doctor;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime appointmentDatetime;
	private String location;
	private AppointmentStatus status;
	private String notes;
}
