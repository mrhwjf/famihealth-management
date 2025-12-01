package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;

import com.famihealth.family_health_management.dto.response.specialization.SpecializationDto;
import com.famihealth.family_health_management.model.Specialization;

@Mapper(componentModel = "spring")
public interface SpecializationMapper {

	SpecializationDto toDto(Specialization entity);
}
