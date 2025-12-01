package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Facility;

public interface FacilityRepository extends JpaRepository<Facility, Integer> {
	Optional<Facility> findByName(String name);

	boolean existsByName(String name);

	Page<Facility> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
