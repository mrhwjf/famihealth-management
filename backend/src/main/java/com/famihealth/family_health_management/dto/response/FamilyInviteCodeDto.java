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
public class FamilyInviteCodeDto {
	private Integer id;
	private Integer familyId;
	private String code;
	private Integer createdBy;
	private LocalDateTime createdAt;
	private Boolean isActive;
}
