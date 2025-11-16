package com.famihealth.family_health_management.dto.response.family_access;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyAccessDto {
	private Integer userId;
	private List<FamilyInfo> families;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class FamilyInfo {
		private Integer familyId;
		private Boolean familyCreator;
		private String accessType;
	}
}
