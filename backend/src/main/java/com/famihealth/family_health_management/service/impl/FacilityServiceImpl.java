package com.famihealth.family_health_management.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.facility.FacilityCreateRequest;
import com.famihealth.family_health_management.dto.request.facility.FacilityUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.faclitiy.FacilityDto;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.FacilityMapper;
import com.famihealth.family_health_management.model.Facility;
import com.famihealth.family_health_management.repository.FacilityRepository;
import com.famihealth.family_health_management.service.FacilityService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FacilityServiceImpl implements FacilityService {

	private final FacilityRepository facilityRepository;
	private final FacilityMapper facilityMapper;

	@Override
	public FacilityDto create(FacilityCreateRequest req) {
		Facility entity = facilityMapper.toEntity(req);
		entity = facilityRepository.save(entity);
		return facilityMapper.toDto(entity);
	}

	@Override
	public FacilityDto updateById(Integer id, FacilityUpdateRequest req) {
		Facility entity = facilityRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Facility not found with id=" + id));
		facilityMapper.updateEntityFromDto(req, entity);
		return facilityMapper.toDto(facilityRepository.save(entity));
	}

	@Override
	public void deleteById(Integer id) {
		if (!facilityRepository.existsById(id)) {
			throw new ResourceNotFoundException("Facility not found with id=" + id);
		}
		facilityRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public FacilityDto getById(Integer id) {
		Facility entity = facilityRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Facility not found with id=" + id));
		return facilityMapper.toDto(entity);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<FacilityDto> getByName(String name, Pageable pageable) {
		Page<Facility> page = facilityRepository.findByNameContainingIgnoreCase(name, pageable);
		return PageResponseMapper.fromPage(page, facilityMapper::toDto);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<FacilityDto> getAll(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return PageResponseMapper.fromPage(facilityRepository.findAll(pageable), facilityMapper::toDto);
		}
		return getByName(name, pageable);
	}
}
