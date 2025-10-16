package com.famihealth.family_health_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Family;

public interface FamilyRepository extends JpaRepository<Family, Integer> {
	List<Family> findByCreator_Id(Integer creatorId);

	List<Family> findByNameContainingIgnoreCase(String name);
}
