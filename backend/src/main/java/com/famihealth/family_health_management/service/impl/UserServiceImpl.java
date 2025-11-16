package com.famihealth.family_health_management.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.famihealth.family_health_management.dto.request.user.UserCreateRequest;
import com.famihealth.family_health_management.dto.request.user.UserUpdateRequest;
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
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
		userMapper.updateEntityFromDto(dto, user);
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
	public PageResponse<UserSummaryDto> getAll(String field, String keyword, Boolean locked, Pageable pageable) {
		if (field != null && keyword != null) {
			return getByKeyword(field, keyword, locked, pageable);
		}
		return PageResponseMapper.fromPage(userRepository.findAll(pageable), userMapper::toSummaryDto);
	}

	@Override
	public PageResponse<UserSummaryDto> getByKeyword(String field, String keyword, Boolean locked, Pageable pageable) {
		Page<User> page;

		switch (field) {
			case "name":
				page = userRepository.findByNameContainingIgnoreCase(keyword, pageable);
				break;
			case "email":
				page = userRepository.findByEmailContainingIgnoreCase(keyword, pageable);
				break;
			case "phone":
				page = userRepository.findByPhoneContainingIgnoreCase(keyword, pageable);
				break;
			case "role":
				page = userRepository.findByRole_Id(Integer.parseInt(keyword), pageable);
				break;
			default:
				throw new IllegalArgumentException("Unsupported search field: " + field);
		}

		// Apply locked filter manually
		if (locked) {
			List<User> filtered = page.getContent().stream()
					.filter(User::getLocked)
					.toList();
			page = new PageImpl<>(filtered, pageable, filtered.size());
		}
		return PageResponseMapper.fromPage(page, userMapper::toSummaryDto);
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

}
