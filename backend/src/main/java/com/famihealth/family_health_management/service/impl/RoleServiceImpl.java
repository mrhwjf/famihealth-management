package com.famihealth.family_health_management.service.impl;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.role.RoleCreateRequest;
import com.famihealth.family_health_management.dto.request.role.RoleUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.role.RoleDto;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.RoleMapper;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.repository.RoleRepository;
import com.famihealth.family_health_management.service.RoleService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

	private final RoleRepository roleRepository;
	private final RoleMapper roleMapper;

	@Override
	public RoleDto create(RoleCreateRequest req) {
		Role role = roleMapper.toEntity(req);
		role = roleRepository.save(role);
		return roleMapper.toDto(role);
	}

	@Override
	public RoleDto updateById(Integer id, RoleUpdateRequest req) {
		// Set<Permission> permissions = new HashSet<>();
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id=" + id));
		roleMapper.updateEntityFromDto(req, role);
		return roleMapper.toDto(roleRepository.save(role));
	}

	@Override
	public void deleteById(Integer id) {
		if (!roleRepository.existsById(id)) {
			throw new ResourceNotFoundException("Role not found with id=" + id);
		}
		roleRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public RoleDto getById(Integer id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id=" + id));
		return roleMapper.toDto(role);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<RoleDto> getByName(String name, Pageable pageable) {
		return PageResponseMapper.fromPage(roleRepository.findByNameContainingIgnoreCase(name, pageable),
				roleMapper::toDto);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<RoleDto> getAll(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return PageResponseMapper.fromPage(roleRepository.findAll(pageable), roleMapper::toDto);
		}
		return getByName(name, pageable);
	}
}
