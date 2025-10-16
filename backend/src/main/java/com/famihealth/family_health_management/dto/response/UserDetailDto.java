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
public class UserDetailDto {
	private Integer id;
	private RoleDto role; // master table
	private String name;
	private String phone;
	private String email;
	private String profileUrl;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Boolean isLocked;
}
