package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.RelationshipsToCreator;

public interface RelationshipsToCreatorRepository extends JpaRepository<RelationshipsToCreator, Integer> {
	Optional<RelationshipsToCreator> findByRelationshipName(String relationshipName);

	Page<RelationshipsToCreator> findByRelationshipNameContainingIgnoreCase(String relationshipName, Pageable pageable);
}
