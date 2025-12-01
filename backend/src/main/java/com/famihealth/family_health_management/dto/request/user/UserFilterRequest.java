package com.famihealth.family_health_management.dto.request.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFilterRequest {
	private String field;
	private String keyword;
	private Boolean locked;
	private Integer roleId; // optional, for filtering doctors
}
