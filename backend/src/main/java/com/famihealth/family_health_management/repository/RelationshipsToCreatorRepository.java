package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.RelationshipsToCreator;

public interface RelationshipsToCreatorRepository extends JpaRepository<RelationshipsToCreator, Integer> {
	Optional<RelationshipsToCreator> findByRelationshipName(String relationshipName);
}
