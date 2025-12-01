package com.famihealth.family_health_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.famihealth.family_health_management.dto.request.relationship_to_creator.RelationshipsToCreatorCreateRequest;
import com.famihealth.family_health_management.dto.request.relationship_to_creator.RelationshipsToCreatorUpdateRequest;
import com.famihealth.family_health_management.dto.response.relationships_to_creator.RelationshipsToCreatorDto;
import com.famihealth.family_health_management.model.RelationshipsToCreator;

@Mapper(componentModel = "spring")
public interface RelationshipsToCreatorMapper {

	RelationshipsToCreatorDto toDto(RelationshipsToCreator entity);

	@Mapping(target = "id", ignore = true)
	RelationshipsToCreator toEntity(RelationshipsToCreatorCreateRequest req);

	@Mapping(target = "id", ignore = true)
	void updateEntityFromDto(RelationshipsToCreatorUpdateRequest req, @MappingTarget RelationshipsToCreator entity);
}
