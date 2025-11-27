package com.famihealth.family_health_management.dto.response.appointment;

import java.util.List;
import java.util.Set;

import com.famihealth.family_health_management.dto.response.common.IdNamePair;
import com.famihealth.family_health_management.enums.AppointmentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentFormDto {
	private List<IdNamePair> familyMembers;
	private List<IdNamePair> doctors;
	private Set<AppointmentStatus> statuses;
	private AppointmentDto appointment;
}
