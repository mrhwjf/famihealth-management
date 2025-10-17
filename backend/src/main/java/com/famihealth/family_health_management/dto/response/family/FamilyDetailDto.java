package com.famihealth.family_health_management.dto.response.family;

import java.util.Set;

import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyDetailDto {
	private Integer id;
	private UserSummaryDto creator;
	private String address;
	private String phone;
	private Set<UserSummaryDto> members;
}
