package com.famihealth.family_health_management.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.HealthStat;

public interface HealthStatRepository extends JpaRepository<HealthStat, Integer> {
	Page<HealthStat> findByFamilyMember_Id(Integer familyMemberId, Pageable pageable);

	Page<HealthStat> findByStatsType_Id(Integer statsTypeId, Pageable pageable);

	Page<HealthStat> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

	Page<HealthStat> findByFamilyMember_IdAndStatsType_Id(Integer familyMemberId, Integer statsTypeId,
			Pageable pageable);

	Page<HealthStat> findByFamilyMember_IdAndCreatedAtBetween(Integer familyMemberId, LocalDateTime start,
			LocalDateTime end, Pageable pageable);

	Page<HealthStat> findByFamilyMember_IdAndStatsType_IdAndCreatedAtBetween(Integer familyMemberId,
			Integer statsTypeId,
			LocalDateTime start, LocalDateTime end, Pageable pageable);
}
