package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.doctor_profile.DoctorProfileCreateRequest;
import com.famihealth.family_health_management.dto.request.doctor_profile.DoctorProfileUpdateRequest;
import com.famihealth.family_health_management.dto.response.doctor_profile.DoctorProfileSummaryDto;
import com.famihealth.family_health_management.model.DoctorProfile;

@Mapper(componentModel = "spring")
public interface DoctorProfileMapper {
	@Mapping(target = "name", source = "doctor.name")
	DoctorProfileSummaryDto toSummaryDto(DoctorProfile entity);

	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "doctorId", ignore = true)
	DoctorProfile toEntity(DoctorProfileCreateRequest req);

	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "doctorId", ignore = true)
	DoctorProfile toEntity(DoctorProfileUpdateRequest req);

	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "doctorId", ignore = true)
	void updateEntityFromDto(DoctorProfileUpdateRequest dto, @MappingTarget DoctorProfile entity);
}
