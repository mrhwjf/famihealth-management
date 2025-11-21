package com.famihealth.family_health_management.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.user.doctor.DoctorCreateRequest;
import com.famihealth.family_health_management.dto.request.user.doctor.DoctorUpdateRequest;
import com.famihealth.family_health_management.dto.response.user.UserDetailDto;
import com.famihealth.family_health_management.mapper.DoctorProfileMapper;
import com.famihealth.family_health_management.mapper.UserMapper;
import com.famihealth.family_health_management.model.DoctorProfile;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.RoleRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.DoctorService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorServiceImpl implements DoctorService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final UserMapper userMapper;
	private final DoctorProfileMapper doctorProfileMapper;

	@Override
	public UserDetailDto create(DoctorCreateRequest req) {
		User user = userMapper.toEntity(req.getUser());

		// Handle role
		if (req.getUser().getRoleId() != null) {
			var role = roleRepository.findById(req.getUser().getRoleId())
					.orElseThrow(() -> new RuntimeException("Role not found"));
			user.setRole(role);
		}

		// Handle doctor profile
		DoctorProfile doctorProfile = doctorProfileMapper.toEntity(req.getDoctorProfile());
		doctorProfile.setDoctor(user);
		user.setDoctorProfile(doctorProfile);
		user = userRepository.save(user);
		return userMapper.toDetailDto(user);
	}

	@Override
	public UserDetailDto update(DoctorUpdateRequest req, Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found"));

		userMapper.updateEntityFromDto(req.getUser(), user);

		// Handle role
		if (req.getUser().getRoleId() != null) {
			var role = roleRepository.findById(req.getUser().getRoleId())
					.orElseThrow(() -> new RuntimeException("Role not found"));
			user.setRole(role);
		}

		// Handle doctor profile
		DoctorProfile doctorProfile = user.getDoctorProfile();
		if (doctorProfile == null) {
			doctorProfile = new DoctorProfile();
			doctorProfile.setDoctor(user);
			user.setDoctorProfile(doctorProfile);
		}
		doctorProfileMapper.updateEntityFromDto(req.getDoctorProfile(), doctorProfile);

		user = userRepository.save(user);
		return userMapper.toDetailDto(user);
	}
}
