package com.famihealth.family_health_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.FamilyMember;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Integer> {
	List<FamilyMember> findByFamily_Id(Integer familyId);

	List<FamilyMember> findByUser_Id(Integer userId);

	List<FamilyMember> findByNameContainingIgnoreCase(String name);
}
