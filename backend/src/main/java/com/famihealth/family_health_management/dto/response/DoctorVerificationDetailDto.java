package com.famihealth.family_health_management.dto.response;

import java.time.LocalDateTime;

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
	private UserSummaryDto admin;
	private String status;
	private LocalDateTime submittedAt;
	private LocalDateTime reviewedAt;
	private String remarks;
}
