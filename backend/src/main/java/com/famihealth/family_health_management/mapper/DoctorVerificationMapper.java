package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationDetailDto;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationSummaryDto;
import com.famihealth.family_health_management.model.DoctorVerification;

@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface DoctorVerificationMapper {

	@Mapping(target = "doctorName", source = "doctor.name")
	@Mapping(target = "adminName", source = "admin.name")
	DoctorVerificationSummaryDto toSummaryDto(DoctorVerification entity);

	@Mapping(target = "adminName", source = "admin.name")
	DoctorVerificationDetailDto toDetailDto(DoctorVerification entity);
}
