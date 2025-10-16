package com.famihealth.family_health_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.VaccinationRecord;

public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecord, Integer> {
	List<VaccinationRecord> findByFamilyMember_Id(Integer familyMemberId);

	List<VaccinationRecord> findByVaccine_Id(Integer vaccineId);

	List<VaccinationRecord> findByAdministeredDateBetween(LocalDate start, LocalDate end);
}
