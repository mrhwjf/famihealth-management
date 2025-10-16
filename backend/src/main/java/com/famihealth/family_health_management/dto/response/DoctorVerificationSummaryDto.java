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
public class DoctorVerificationSummaryDto {
	private Integer id;
	private String doctorName;
	private String adminName;
	private String status;
	private LocalDateTime submittedAt;
	private LocalDateTime reviewedAt;
	private String remarks;
}
