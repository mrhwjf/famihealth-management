package com.famihealth.family_health_management.dto.response.family;

import java.util.Set;

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
	private Integer creatorId;
	private String address;
	private String phone;
	private Set<Integer> memberIds;
}
