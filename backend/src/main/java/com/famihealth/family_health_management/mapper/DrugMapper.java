package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.drug.DrugCreateRequest;
import com.famihealth.family_health_management.dto.request.drug.DrugUpdateRequest;
import com.famihealth.family_health_management.dto.response.drug.DrugDto;
import com.famihealth.family_health_management.model.Drug;

@Mapper(componentModel = "spring")
public interface DrugMapper {

	@Mapping(target = "id", ignore = true)
	Drug toEntity(DrugCreateRequest dto);

	@Mapping(target = "id", ignore = true)
	void updateEntityFromDto(DrugUpdateRequest dto, @MappingTarget Drug entity);

	DrugDto toDto(Drug entity);

}
