package com.famihealth.family_health_management.model;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberAccessId implements Serializable {
	private Integer memberId;
	private Integer doctorId;
}
