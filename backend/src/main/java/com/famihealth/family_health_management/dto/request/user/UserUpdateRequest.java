package com.famihealth.family_health_management.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
	private Integer roleId;

	@Size(max = 255)
	private String password;

	@Size(max = 255)
	private String name;

	@Size(max = 50)
	private String phone;

	@Email
	@Size(max = 255)
	private String email;

	@Size(max = 1000)
	private String profileUrl;

	private Boolean locked;
}
