package com.famihealth.family_health_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.HealthStatsType;

public interface HealthStatsTypeRepository extends JpaRepository<HealthStatsType, Integer> {
	Optional<HealthStatsType> findByName(String name);

	List<HealthStatsType> findByNameContainingIgnoreCase(String name);

	Page<HealthStatsType> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
