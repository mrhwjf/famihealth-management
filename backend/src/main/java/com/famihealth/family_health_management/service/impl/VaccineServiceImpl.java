package com.famihealth.family_health_management.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.vaccine.VaccineCreateRequest;
import com.famihealth.family_health_management.dto.request.vaccine.VaccineUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.vaccine.VaccineDto;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.VaccineMapper;
import com.famihealth.family_health_management.model.Vaccine;
import com.famihealth.family_health_management.repository.VaccineRepository;
import com.famihealth.family_health_management.service.VaccineService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class VaccineServiceImpl implements VaccineService {

	private final VaccineRepository vaccineRepository;
	private final VaccineMapper vaccineMapper;

	@Override
	public VaccineDto create(VaccineCreateRequest req) {
		Vaccine entity = vaccineMapper.toEntity(req);
		entity = vaccineRepository.save(entity);
		return vaccineMapper.toDto(entity);
	}

	@Override
	public VaccineDto updateById(Integer id, VaccineUpdateRequest req) {
		Vaccine entity = vaccineRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with id=" + id));
		vaccineMapper.updateEntityFromDto(req, entity);
		return vaccineMapper.toDto(vaccineRepository.save(entity));
	}

	@Override
	public void deleteById(Integer id) {
		if (!vaccineRepository.existsById(id)) {
			throw new ResourceNotFoundException("Vaccine not found with id=" + id);
		}
		vaccineRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public VaccineDto getById(Integer id) {
		Vaccine entity = vaccineRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with id=" + id));
		return vaccineMapper.toDto(entity);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<VaccineDto> getByName(String name, Pageable pageable) {
		Page<Vaccine> page = vaccineRepository.findByNameContainingIgnoreCase(name, pageable);
		return PageResponseMapper.fromPage(page, vaccineMapper::toDto);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<VaccineDto> getAll(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return PageResponseMapper.fromPage(vaccineRepository.findAll(pageable), vaccineMapper::toDto);
		}
		return getByName(name, pageable);
	}
}
