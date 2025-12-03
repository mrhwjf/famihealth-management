package com.famihealth.family_health_management.dto.response.user;

import java.util.List;

import com.famihealth.family_health_management.dto.response.common.IdNamePair;
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
	private List<IdNamePair> roles;
	private List<IdNamePair> specializations;
	private List<IdNamePair> facilities;
}
