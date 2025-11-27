package com.famihealth.family_health_management.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.FamilyMember;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Integer> {
	List<FamilyMember> findByFamily_Id(Integer familyId);

	List<FamilyMember> findByUser_Id(Integer userId);

	List<FamilyMember> findByNameContainingIgnoreCase(String name);

	Set<Integer> findIdByFamily_Id(Integer familyId);

	// Fetch all family members (patients) linked to a specific doctor
	List<FamilyMember> findDistinctByMemberAccesses_DoctorId(Integer doctorId);

	// Fetch all family members in a specific family using the family creator's user
	// ID
	List<FamilyMember> findByFamily_Creator_Id(Integer creatorUserId);

}
