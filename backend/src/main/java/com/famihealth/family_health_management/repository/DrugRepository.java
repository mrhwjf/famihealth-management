package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Drug;

public interface DrugRepository extends JpaRepository<Drug, Integer> {
	Optional<Drug> findByName(String name);

	boolean existsByName(String name);

	Page<Drug> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
