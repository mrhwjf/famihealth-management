package com.famihealth.family_health_management.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.drug.DrugCreateRequest;
import com.famihealth.family_health_management.dto.request.drug.DrugUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.drug.DrugDto;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.DrugMapper;
import com.famihealth.family_health_management.model.Drug;
import com.famihealth.family_health_management.repository.DrugRepository;
import com.famihealth.family_health_management.service.DrugService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DrugServiceImpl implements DrugService {

	private final DrugRepository drugRepository;
	private final DrugMapper drugMapper;

	@Override
	public DrugDto create(DrugCreateRequest req) {
		Drug entity = drugMapper.toEntity(req);
		entity = drugRepository.save(entity);
		return drugMapper.toDto(entity);
	}

	@Override
	public DrugDto updateById(Integer id, DrugUpdateRequest req) {
		Drug entity = drugRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Drug not found with id=" + id));
		drugMapper.updateEntityFromDto(req, entity);
		return drugMapper.toDto(drugRepository.save(entity));
	}

	@Override
	public void deleteById(Integer id) {
		if (!drugRepository.existsById(id)) {
			throw new ResourceNotFoundException("Drug not found with id=" + id);
		}
		drugRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public DrugDto getById(Integer id) {
		Drug entity = drugRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Drug not found with id=" + id));
		return drugMapper.toDto(entity);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<DrugDto> getByName(String name, Pageable pageable) {
		Page<Drug> page = drugRepository.findByNameContainingIgnoreCase(name, pageable);
		return PageResponseMapper.fromPage(page, drugMapper::toDto);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<DrugDto> getAll(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return PageResponseMapper.fromPage(drugRepository.findAll(pageable), drugMapper::toDto);
		}
		return getByName(name, pageable);
	}
}
