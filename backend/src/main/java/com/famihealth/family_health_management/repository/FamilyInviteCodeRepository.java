package com.famihealth.family_health_management.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.FamilyInviteCode;

public interface FamilyInviteCodeRepository extends JpaRepository<FamilyInviteCode, Integer> {
	Optional<FamilyInviteCode> findByCode(String code);

	List<FamilyInviteCode> findByFamily_Id(Integer familyId);

	List<FamilyInviteCode> findByCreatedBy_Id(Integer createdById);

	List<FamilyInviteCode> findByActive(Boolean active);
}
