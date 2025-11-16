package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.facility.FacilityCreateRequest;
import com.famihealth.family_health_management.dto.request.facility.FacilityUpdateRequest;
import com.famihealth.family_health_management.dto.response.faclitiy.FacilityDto;
import com.famihealth.family_health_management.model.Facility;

@Mapper(componentModel = "spring")
public interface FacilityMapper {

	FacilityDto toDto(Facility entity);

	@Mapping(target = "id", ignore = true)
	Facility toEntity(FacilityCreateRequest req);

	@Mapping(target = "id", ignore = true)
	void updateEntityFromDto(FacilityUpdateRequest req, @MappingTarget Facility entity);
}
