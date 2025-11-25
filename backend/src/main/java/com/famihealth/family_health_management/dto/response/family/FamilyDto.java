package com.famihealth.family_health_management.dto.response.family;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyDto {
	private Integer id;
	private String creatorName;
	private String name;
	private String address;
	private String phone;
	private Integer memberCount;
}
