package com.famihealth.family_health_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
	Optional<Role> findByName(String name);

	List<Role> findByNameContainingIgnoreCase(String name);

	Page<Role> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
