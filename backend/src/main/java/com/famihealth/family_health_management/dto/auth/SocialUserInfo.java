package com.famihealth.family_health_management.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SocialUserInfo {
	private String provider;
	private String providerId;
	private String email;
	private String name;
	private String pictureUrl;
}
