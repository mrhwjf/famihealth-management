package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	Optional<User> findByEmail(String email);

	Optional<User> findByPhone(String phone);

	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);

	Page<User> findByRole_Id(Integer roleId, Pageable pageable);

	Page<User> findByLocked(Boolean locked, Pageable pageable);

	Page<User> findByEmailContainingIgnoreCase(String keyword, Pageable pageable);

	Page<User> findByPhoneContainingIgnoreCase(String keyword, Pageable pageable);

	Page<User> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}
