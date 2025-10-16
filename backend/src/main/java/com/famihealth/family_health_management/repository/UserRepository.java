package com.famihealth.family_health_management.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	Optional<User> findByEmail(String email);

	Optional<User> findByPhone(String phone);

	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);

	List<User> findByRole_Id(Integer roleId);

	List<User> findByIsLocked(Boolean isLocked);
}
