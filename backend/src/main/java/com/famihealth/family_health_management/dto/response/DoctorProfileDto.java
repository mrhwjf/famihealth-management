package com.famihealth.family_health_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfileDto {
	private Integer doctorId; // Which is the user id
	private String licenseNumber;
	private String certificateFileUrl;
	private Boolean isVerified;
}
