package com.famihealth.family_health_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.DoctorProfile;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Integer> {
	Optional<DoctorProfile> findByDoctorId(Integer doctorId);

	Optional<DoctorProfile> findByLicenseNumber(String licenseNumber);

	List<DoctorProfile> findByIsVerified(Boolean isVerified);
}
