package com.famihealth.family_health_management.dto.response.family_access;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyAccessDto {
	private Integer familyId;
	private Integer userId;
	private Boolean familyCreator;
}
