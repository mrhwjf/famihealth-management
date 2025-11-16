package com.famihealth.family_health_management.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.permission.PermissionCreateRequest;
import com.famihealth.family_health_management.dto.request.permission.PermissionUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.permission.PermissionDto;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.PermissionMapper;
import com.famihealth.family_health_management.model.Permission;
import com.famihealth.family_health_management.repository.PermissionRepository;
import com.famihealth.family_health_management.service.PermissionService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PermissionServiceImpl implements PermissionService {

	private final PermissionRepository permissionRepository;
	private final PermissionMapper permissionMapper;

	@Override
	public PermissionDto create(PermissionCreateRequest req) {
		Permission entity = permissionMapper.toEntity(req);
		entity = permissionRepository.save(entity);
		return permissionMapper.toDto(entity);
	}

	@Override
	public PermissionDto updateById(Integer id, PermissionUpdateRequest req) {
		Permission entity = permissionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Permission not found with id=" + id));
		permissionMapper.updateEntityFromDto(req, entity);
		return permissionMapper.toDto(permissionRepository.save(entity));
	}

	@Override
	public void deleteById(Integer id) {
		if (!permissionRepository.existsById(id)) {
			throw new ResourceNotFoundException("Permission not found with id=" + id);
		}
		permissionRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public PermissionDto getById(Integer id) {
		Permission entity = permissionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Permission not found with id=" + id));
		return permissionMapper.toDto(entity);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<PermissionDto> getByName(String name, Pageable pageable) {
		Page<Permission> page = permissionRepository.findByNameContainingIgnoreCase(name, pageable);
		return PageResponseMapper.fromPage(page, permissionMapper::toDto);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<PermissionDto> getAll(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return PageResponseMapper.fromPage(permissionRepository.findAll(pageable), permissionMapper::toDto);
		}
		return getByName(name, pageable);
	}
}
