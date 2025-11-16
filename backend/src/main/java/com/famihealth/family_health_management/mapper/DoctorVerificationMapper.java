package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.doctor_verification.DoctorVerificationCreateRequest;
import com.famihealth.family_health_management.dto.request.doctor_verification.DoctorVerificationUpdateRequest;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationDetailDto;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationSummaryDto;
import com.famihealth.family_health_management.model.DoctorVerification;
import com.famihealth.family_health_management.model.Role;

@Mapper(componentModel = "spring")
public interface DoctorVerificationMapper {

	@Mapping(target = "adminName", source = "admin.name")
	@Mapping(target = "doctorName", source = "doctor.name")
	DoctorVerificationSummaryDto toSummaryDto(DoctorVerification entity);

	@Mapping(target = "adminName", source = "admin.name")
	@Mapping(target = "doctor.role", source = "doctor.role")
	DoctorVerificationDetailDto toDetailDto(DoctorVerification entity);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "admin", ignore = true)
	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "submittedAt", ignore = true)
	@Mapping(target = "reviewedAt", ignore = true)
	DoctorVerification toEntity(DoctorVerificationCreateRequest dto);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "admin", ignore = true)
	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "submittedAt", ignore = true)
	@Mapping(target = "reviewedAt", ignore = true)
	void updateEntityFromDto(DoctorVerificationUpdateRequest dto, @MappingTarget DoctorVerification entity);

	default String map(Role role) {
		return role == null ? null : role.getName();
	}
}
