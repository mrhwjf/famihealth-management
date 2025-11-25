package com.famihealth.family_health_management.dto.request.medical_document;

import jakarta.validation.constraints.NotBlank;
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

	@Size(max = 255)
	private String fileType;

	@NotBlank
	@Size(max = 255)
	private String fileName;

	@NotBlank
	@Size(max = 1024)
	private String fileUrl;
}
