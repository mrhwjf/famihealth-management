package com.famihealth.family_health_management.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.health_stats_type.HealthStatsTypeCreateRequest;
import com.famihealth.family_health_management.dto.request.health_stats_type.HealthStatsTypeUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.health_stats_type.HealthStatsTypeDto;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.HealthStatsTypeMapper;
import com.famihealth.family_health_management.model.HealthStatsType;
import com.famihealth.family_health_management.repository.HealthStatsTypeRepository;
import com.famihealth.family_health_management.service.HealthStatsTypeService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthStatsTypeServiceImpl implements HealthStatsTypeService {

	private final HealthStatsTypeRepository repository;
	private final HealthStatsTypeMapper mapper;

	@Override
	public HealthStatsTypeDto create(HealthStatsTypeCreateRequest req) {
		HealthStatsType entity = mapper.toEntity(req);
		entity = repository.save(entity);
		return mapper.toDto(entity);
	}

	@Override
	public HealthStatsTypeDto updateById(Integer id, HealthStatsTypeUpdateRequest req) {
		HealthStatsType entity = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("HealthStatsType not found with id=" + id));
		mapper.updateEntityFromDto(req, entity);
		return mapper.toDto(repository.save(entity));
	}

	@Override
	public void deleteById(Integer id) {
		if (!repository.existsById(id)) {
			throw new ResourceNotFoundException("HealthStatsType not found with id=" + id);
		}
		repository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public HealthStatsTypeDto getById(Integer id) {
		HealthStatsType entity = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("HealthStatsType not found with id=" + id));
		return mapper.toDto(entity);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<HealthStatsTypeDto> getByName(String name, Pageable pageable) {
		Page<HealthStatsType> page = repository.findByNameContainingIgnoreCase(name, pageable);
		return PageResponseMapper.fromPage(page, mapper::toDto);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<HealthStatsTypeDto> getAll(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return PageResponseMapper.fromPage(repository.findAll(pageable), mapper::toDto);
		}
		return getByName(name, pageable);
	}
}
