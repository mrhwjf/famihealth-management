package com.famihealth.family_health_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.famihealth.family_health_management.model.Family;

public interface FamilyRepository extends JpaRepository<Family, Integer>, JpaSpecificationExecutor<Family> {

}
