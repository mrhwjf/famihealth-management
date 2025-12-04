package com.famihealth.family_health_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Allergy;

public interface AllergyRepository extends JpaRepository<Allergy, Integer> {
	List<Allergy> findByFamilyMember_Id(Integer familyMemberId);

	List<Allergy> findByFamilyMember_Family_Id(Integer familyId);
}
