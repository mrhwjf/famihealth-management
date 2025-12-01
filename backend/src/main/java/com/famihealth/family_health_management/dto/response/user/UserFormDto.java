package com.famihealth.family_health_management.dto.response.user;

import java.util.Set;

import com.famihealth.family_health_management.dto.response.role.RoleDto;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFormDto {
	@JsonUnwrapped
	private UserDetailDto userDetails;
	private Set<RoleDto> roles;
}
