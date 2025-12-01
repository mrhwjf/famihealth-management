package com.famihealth.family_health_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Specialization;

public interface SpecializationRepository extends JpaRepository<Specialization, Integer> {
}
