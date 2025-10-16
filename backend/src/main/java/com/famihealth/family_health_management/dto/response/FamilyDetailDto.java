package com.famihealth.family_health_management.dto.response;

import java.util.Set;

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
