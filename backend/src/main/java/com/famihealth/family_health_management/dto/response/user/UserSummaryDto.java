package com.famihealth.family_health_management.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryDto {
	private Integer id;
	private String role;
	private String name;
	private String phone;
	private String email;
	private String profileUrl;
	private Boolean locked;
}
