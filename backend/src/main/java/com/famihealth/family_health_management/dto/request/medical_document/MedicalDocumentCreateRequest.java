package com.famihealth.family_health_management.dto.request.medical_document;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalDocumentCreateRequest {
	@NotNull
	private Integer medicalRecordId;

	@Size(max = 100)
	private String fileType;

	@Size(max = 255)
	private String fileName;

	@Size(max = 2000)
	private String fileUrl;
}
