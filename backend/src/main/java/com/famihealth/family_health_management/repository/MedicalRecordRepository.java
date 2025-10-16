package com.famihealth.family_health_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.MedicalRecord;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {
	List<MedicalRecord> findByFamilyMember_Id(Integer familyMemberId);

	List<MedicalRecord> findByDoctor_Id(Integer doctorId);

	List<MedicalRecord> findByFacility_Id(Integer facilityId);

	List<MedicalRecord> findByDateBetween(LocalDate start, LocalDate end);
}
