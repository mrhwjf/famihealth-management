package com.famihealth.family_health_management.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Vaccine;

public interface VaccineRepository extends JpaRepository<Vaccine, Integer> {
	Optional<Vaccine> findByName(String name);

	boolean existsByName(String name);

	List<Vaccine> findByNameContainingIgnoreCase(String name);
}
