package com.famihealth.family_health_management.repository;

import com.famihealth.family_health_management.model.FamilyAccess;
import com.famihealth.family_health_management.model.FamilyAccessId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FamilyAccessRepository extends JpaRepository<FamilyAccess, FamilyAccessId> {
	List<FamilyAccess> findByFamilyId(Integer familyId);

	List<FamilyAccess> findByUserId(Integer userId);

	void deleteByFamilyIdAndUserId(Integer familyId, Integer userId);

	Optional<FamilyAccess> findByFamilyIdAndUserId(Integer familyId, Integer userId);

	boolean existsByFamilyIdAndUserId(Integer familyId, Integer userId);
}
