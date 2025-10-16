package com.famihealth.family_health_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
	List<Prescription> findByMedicalRecord_Id(Integer medicalRecordId);
}
