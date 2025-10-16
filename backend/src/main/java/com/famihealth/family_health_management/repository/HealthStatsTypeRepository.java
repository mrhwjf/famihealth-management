package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.HealthStatsType;

public interface HealthStatsTypeRepository extends JpaRepository<HealthStatsType, Integer> {
	Optional<HealthStatsType> findByName(String name);
}
