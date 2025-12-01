package com.famihealth.family_health_management.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.FamilyInviteCode;

public interface FamilyInviteCodeRepository extends JpaRepository<FamilyInviteCode, Integer> {
	Optional<FamilyInviteCode> findByCode(String code);

	Optional<FamilyInviteCode> findByFamily_Id(Integer familyId);

	Optional<FamilyInviteCode> findByFamily_IdAndActiveTrue(Integer familyId);

	Optional<FamilyInviteCode> findByFamily_IdAndCode(Integer familyId, String code);

	boolean existsByFamily_Id(Integer familyId);
}
