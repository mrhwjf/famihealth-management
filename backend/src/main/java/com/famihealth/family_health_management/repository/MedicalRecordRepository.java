package com.famihealth.family_health_management.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.MedicalRecord;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {
	Page<MedicalRecord> findByFamilyMember_Id(Integer familyMemberId, Pageable pageable);
}
