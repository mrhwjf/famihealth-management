package com.famihealth.family_health_management.dto.response.member_access;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberAccessDto {
	private Integer doctorId;
	private Set<Integer> memberIds; // IDs of family members the doctor has access to
}
