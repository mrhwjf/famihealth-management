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
public class MedicalDocumentSummaryDto {
	private Integer id;
	private String patientName; // Use patient name to display in UI
	private String fileType;
	private String fileName;
	private LocalDateTime uploadDate;
	private String fileUrl;
}
