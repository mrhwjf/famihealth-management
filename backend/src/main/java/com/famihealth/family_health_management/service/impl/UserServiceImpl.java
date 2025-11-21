package com.famihealth.family_health_management.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.famihealth.family_health_management.dto.request.user.UserCreateRequest;
import com.famihealth.family_health_management.dto.request.user.UserFilterRequest;
import com.famihealth.family_health_management.dto.request.user.UserUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.FilterOptionDto;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;
import com.famihealth.family_health_management.dto.response.user.UserFormDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;
import com.famihealth.family_health_management.mapper.UserMapper;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.RoleRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.UserService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import com.famihealth.family_health_management.specs.UserSpecs;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final RoleRepository roleRepository;

	@Override
	public UserDetailDto create(UserCreateRequest dto) {
		User user = userMapper.toEntity(dto);

		// Handle role
		if (dto.getRoleId() != null) {
			Role role = roleRepository.findById(dto.getRoleId())
					.orElseThrow(() -> new RuntimeException("Role not found"));
			user.setRole(role);
		}

		user = userRepository.save(user);
		return userMapper.toDetailDto(user);
	}

	@Override
	@Transactional(readOnly = true)
	public UserDetailDto getById(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
		return userMapper.toDetailDto(user);
	}

	@Override
	public UserDetailDto updateById(Integer id, UserUpdateRequest dto) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found"));

		// 1. Update simple fields
		userMapper.updateEntityFromDto(dto, user);

		// 2. Handle role
		if (dto.getRoleId() != null) {
			Role role = roleRepository.findById(dto.getRoleId())
					.orElseThrow(() -> new RuntimeException("Role not found"));
			user.setRole(role);
		}

		user = userRepository.save(user);
		return userMapper.toDetailDto(user);
	}

	@Override
	public void deleteById(Integer id) {
		if (!userRepository.existsById(id)) {
			throw new RuntimeException("User not found with id: " + id);
		}
		userRepository.deleteById(id);
	}

	@Override
	public PageResponse<UserSummaryDto> getAll(UserFilterRequest filter, Pageable pageable) {
		Specification<User> spec = UserSpecs.filter(filter); // always create spec
		Page<User> result = userRepository.findAll(spec, pageable);
		return PageResponseMapper.fromPage(result, userMapper::toSummaryDto);
	}

	@Override
	@Transactional(readOnly = true)
	public UserFormDto getCreateFormData() {
		Set<Role> allRoles = new HashSet<>(roleRepository.findAll());
		// Pass null user to mapper — userDetails will be null
		return userMapper.toFormDto(null, allRoles);
	}

	@Override
	@Transactional(readOnly = true)
	public UserFormDto getEditFormData(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));

		Set<Role> allRoles = new HashSet<>(roleRepository.findAll());
		return userMapper.toFormDto(user, allRoles);
	}

	@Override
	@Transactional(readOnly = true)
	public FilterOptionDto getFilterOptions() {
		// 1. Dropdowns: role
		List<FilterOptionDto.DropdownOption> roleOptions = roleRepository.findAll().stream()
				.map(role -> new FilterOptionDto.DropdownOption(
						role.getId(), // value
						role.getName(), // label
						null // optional description
				))
				.toList();

		FilterOptionDto.DropdownFilterOption roleDropdown = new FilterOptionDto.DropdownFilterOption(
				"roleId", // field name
				"Role", // label for frontend
				roleOptions,
				false // single-select
		);

		// 2. Booleans: locked
		FilterOptionDto.BooleanFilterOption lockedFilter = new FilterOptionDto.BooleanFilterOption(
				"locked",
				"Locked Status",
				null // no default selected
		);

		// 3. Searchable fields: name, email, phone
		List<FilterOptionDto.SearchableFieldOption> searchableFields = List.of(
				new FilterOptionDto.SearchableFieldOption("name", "Name", "Search by name"),
				new FilterOptionDto.SearchableFieldOption("email", "Email", "Search by email"),
				new FilterOptionDto.SearchableFieldOption("phone", "Phone", "Search by phone"));

		// 4. Compose the final FilterOptionDto
		return new FilterOptionDto(
				List.of(roleDropdown), // dropdowns
				List.of(lockedFilter), // booleans
				List.of(), // dateRanges (none for now)
				searchableFields // searchableFields
		);
	}

}
