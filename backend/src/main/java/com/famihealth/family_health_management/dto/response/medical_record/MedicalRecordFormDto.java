package com.famihealth.family_health_management.dto.response.medical_record;

import java.util.List;

import com.famihealth.family_health_management.dto.response.common.IdNamePair;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordFormDto {
	private MedicalRecordDetailDto medicalRecord;
	private List<IdNamePair> familyMembers;
	private List<IdNamePair> facilities;
}
