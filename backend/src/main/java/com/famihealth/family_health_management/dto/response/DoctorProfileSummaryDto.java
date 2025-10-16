package com.famihealth.family_health_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfileSummaryDto {
	private String name; // Doctor's name, taken from User entity, field 'name'
	private String licenseNumber;
	private String certificateFileUrl;
	private Boolean isVerified;
}
