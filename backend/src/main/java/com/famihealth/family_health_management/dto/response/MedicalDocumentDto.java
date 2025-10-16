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
public class MedicalDocumentDto {
	private Integer id;
	private Integer medicalRecordId;
	private String fileType;
	private String fileName;
	private LocalDateTime uploadDate;
	private String fileUrl;
}
