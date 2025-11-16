package com.famihealth.family_health_management.dto.response.doctor_verification;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;
import com.famihealth.family_health_management.enums.VerificationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorVerificationDetailDto {
	private Integer id;
	private UserSummaryDto doctor;
	private String adminName;
	private VerificationStatus status;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime submittedAt;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime reviewedAt;
	private String remarks;
}
