package com.famihealth.family_health_management.dto.response.family;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilySummaryDto {
	private Integer id;
	private String address;
	private String phone;
}
