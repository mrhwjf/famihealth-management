package com.famihealth.family_health_management.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.relationship_to_creator.RelationshipsToCreatorCreateRequest;
import com.famihealth.family_health_management.dto.request.relationship_to_creator.RelationshipsToCreatorUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.relationships_to_creator.RelationshipsToCreatorDto;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.RelationshipsToCreatorMapper;
import com.famihealth.family_health_management.model.RelationshipsToCreator;
import com.famihealth.family_health_management.repository.RelationshipsToCreatorRepository;
import com.famihealth.family_health_management.service.RelationshipsToCreatorService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RelationshipsToCreatorServiceImpl implements RelationshipsToCreatorService {

	private final RelationshipsToCreatorRepository repo;
	private final RelationshipsToCreatorMapper mapper;

	@Override
	public RelationshipsToCreatorDto getById(Integer id) {
		RelationshipsToCreator entity = repo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("RelationshipsToCreator not found with id=" + id));
		return mapper.toDto(entity);
	}

	@Override
	public PageResponse<RelationshipsToCreatorDto> getByName(String relationshipName, Pageable pageable) {
		Page<RelationshipsToCreator> page = repo.findByRelationshipNameContainingIgnoreCase(relationshipName, pageable);
		return PageResponseMapper.fromPage(page, mapper::toDto);
	}

	@Override
	public PageResponse<RelationshipsToCreatorDto> getAll(String relationshipName, Pageable pageable) {
		if (relationshipName == null || relationshipName.isEmpty()) {
			Page<RelationshipsToCreator> page = repo.findAll(pageable);
			return PageResponseMapper.fromPage(page, mapper::toDto);
		}
		return getByName(relationshipName, pageable);
	}

	@Override
	public RelationshipsToCreatorDto create(RelationshipsToCreatorCreateRequest dto) {
		RelationshipsToCreator entity = mapper.toEntity(dto);
		entity = repo.save(entity);
		return mapper.toDto(entity);
	}

	@Override
	public RelationshipsToCreatorDto updateById(Integer id, RelationshipsToCreatorUpdateRequest dto) {
		RelationshipsToCreator entity = repo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("RelationshipsToCreator not found with id=" + id));
		mapper.updateEntityFromDto(dto, entity);
		entity = repo.save(entity);
		return mapper.toDto(entity);
	}

	@Override
	public void deleteById(Integer id) {
		RelationshipsToCreator entity = repo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("RelationshipsToCreator not found with id=" + id));
		repo.delete(entity);
	}
}
