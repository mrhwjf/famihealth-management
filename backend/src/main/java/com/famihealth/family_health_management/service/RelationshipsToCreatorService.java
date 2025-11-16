package com.famihealth.family_health_management.service;

import org.springframework.data.domain.Pageable;

import com.famihealth.family_health_management.dto.request.relationship_to_creator.RelationshipsToCreatorCreateRequest;
import com.famihealth.family_health_management.dto.request.relationship_to_creator.RelationshipsToCreatorUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.relationships_to_creator.RelationshipsToCreatorDto;

public interface RelationshipsToCreatorService {
	RelationshipsToCreatorDto getById(Integer id);

	RelationshipsToCreatorDto create(RelationshipsToCreatorCreateRequest dto);

	RelationshipsToCreatorDto updateById(Integer id, RelationshipsToCreatorUpdateRequest dto);

	void deleteById(Integer id);

	PageResponse<RelationshipsToCreatorDto> getByName(String relationshipName, Pageable pageable);

	PageResponse<RelationshipsToCreatorDto> getAll(String relationshipName, Pageable pageable);
}
