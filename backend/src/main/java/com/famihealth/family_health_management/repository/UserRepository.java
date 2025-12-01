package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.famihealth.family_health_management.model.User;

public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
	Optional<User> findByEmailIgnoreCase(String email);

	Optional<User> findByPhone(String phone);

	Optional<User> findByEmailIgnoreCaseOrPhone(String email, String phone);

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByPhone(String phone);

}
