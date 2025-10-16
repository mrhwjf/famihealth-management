package com.famihealth.family_health_management.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Drug;

public interface DrugRepository extends JpaRepository<Drug, Integer> {
	Optional<Drug> findByName(String name);

	boolean existsByName(String name);

	List<Drug> findByNameContainingIgnoreCase(String name);
}
