package com.famihealth.family_health_management.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.HealthStat;

public interface HealthStatRepository extends JpaRepository<HealthStat, Integer> {
	List<HealthStat> findByFamilyMember_Id(Integer familyMemberId);

	List<HealthStat> findByStatsType_Id(Integer statsTypeId);

	List<HealthStat> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
