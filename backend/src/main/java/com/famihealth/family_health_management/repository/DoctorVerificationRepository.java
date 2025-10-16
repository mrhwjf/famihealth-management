package com.famihealth.family_health_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.DoctorVerification;

public interface DoctorVerificationRepository extends JpaRepository<DoctorVerification, Integer> {
	List<DoctorVerification> findByDoctor_Id(Integer doctorId);

	List<DoctorVerification> findByAdmin_Id(Integer adminId);

	List<DoctorVerification> findByStatus(String status);
}
