package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.vaccine.VaccineCreateRequest;
import com.famihealth.family_health_management.dto.request.vaccine.VaccineUpdateRequest;
import com.famihealth.family_health_management.dto.response.vaccine.VaccineDto;
import com.famihealth.family_health_management.model.Vaccine;

@Mapper(componentModel = "spring")
public interface VaccineMapper {

	VaccineDto toDto(Vaccine entity);

	@Mapping(target = "id", ignore = true)
	Vaccine toEntity(VaccineCreateRequest req);

	@Mapping(target = "id", ignore = true)
	void updateEntityFromDto(VaccineUpdateRequest req, @MappingTarget Vaccine entity);
}
