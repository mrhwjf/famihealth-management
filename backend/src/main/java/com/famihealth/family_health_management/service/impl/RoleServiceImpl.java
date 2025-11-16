package com.famihealth.family_health_management.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.role.RoleCreateRequest;
import com.famihealth.family_health_management.dto.request.role.RoleUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.role.RoleDetailDto;
import com.famihealth.family_health_management.dto.response.role.RoleFormDto;
import com.famihealth.family_health_management.dto.response.role.RoleSummaryDto;
import com.famihealth.family_health_management.exception.ResourceNotFoundException;
import com.famihealth.family_health_management.mapper.RoleMapper;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.model.Permission;
import com.famihealth.family_health_management.repository.RoleRepository;
import com.famihealth.family_health_management.repository.PermissionRepository;
import com.famihealth.family_health_management.service.RoleService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

	private final RoleRepository roleRepository;
	private final PermissionRepository permissionRepository;
	private final RoleMapper roleMapper;

	@Override
	public RoleDetailDto create(RoleCreateRequest req) {
		Role role = roleMapper.toEntity(req);
		// Assign permissions if provided
		if (req.getPermissionIds() != null) {
			Set<Permission> permissions = permissionRepository.findByIdIn(req.getPermissionIds());
			if (permissions.size() != req.getPermissionIds().size()) {
				throw new ResourceNotFoundException(
						"One or more permissions not found for IDs=" + req.getPermissionIds());
			}
			role.setPermissions(permissions);
		}
		role = roleRepository.save(role);
		return roleMapper.toDetailsDto(role);
	}

	@Override
	public RoleDetailDto updateById(Integer id, RoleUpdateRequest req) {
		Set<Permission> permissions = new HashSet<>();
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id=" + id));
		roleMapper.updateEntityFromDto(req, role);
		// Replace permissions only if field provided
		if (req.getPermissionIds() != null) {
			permissions = permissionRepository.findByIdIn(req.getPermissionIds());
			if (permissions.size() != req.getPermissionIds().size()) {
				throw new ResourceNotFoundException(
						"One or more permissions not found for IDs=" + req.getPermissionIds());
			}
			role.setPermissions(permissions);
		}
		return roleMapper.toDetailsDto(roleRepository.save(role));
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
	public RoleDetailDto getById(Integer id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id=" + id));
		return roleMapper.toDetailsDto(role);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<RoleSummaryDto> getByName(String name, Pageable pageable) {
		return PageResponseMapper.fromPage(roleRepository.findByNameContainingIgnoreCase(name, pageable),
				roleMapper::toSummaryDto);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<RoleSummaryDto> getAll(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return PageResponseMapper.fromPage(roleRepository.findAll(pageable), roleMapper::toSummaryDto);
		}
		return getByName(name, pageable);
	}

	@Override
	@Transactional(readOnly = true)
	public RoleFormDto getCreateFormData() {
		// Pass null for role — nothing assigned yet
		Set<Permission> allPermissions = new HashSet<>(permissionRepository.findAll());
		return roleMapper.toFormDto(null, allPermissions);
	}

	@Override
	@Transactional(readOnly = true)
	public RoleFormDto getEditFormData(Integer id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id=" + id));

		Set<Permission> allPermissions = new HashSet<>(permissionRepository.findAll());
		return roleMapper.toFormDto(role, allPermissions);
	}

}
