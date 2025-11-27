package com.famihealth.family_health_management.dto.request.medical_document;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalDocumentUpdateRequest {

	@Size(max = 255)
	private String fileName;

	@Size(max = 1024)
	private String fileUrl;
}
