package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Integer> {
	Optional<Permission> findByName(String name);

	Page<Permission> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
