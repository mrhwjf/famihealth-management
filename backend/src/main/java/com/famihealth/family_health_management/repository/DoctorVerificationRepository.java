package com.famihealth.family_health_management.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.famihealth.family_health_management.enums.VerificationStatus;
import com.famihealth.family_health_management.model.DoctorVerification;

public interface DoctorVerificationRepository extends JpaRepository<DoctorVerification, Integer> {

	Page<DoctorVerification> findByDoctorId(Integer doctorId, Pageable pageable);

	Optional<DoctorVerification> findTopByDoctorIdOrderBySubmittedAtDesc(Integer doctorId);

	Optional<DoctorVerification> findFirstByDoctorIdAndStatusOrderBySubmittedAtDesc(
			Integer doctorId, VerificationStatus status);

	Page<DoctorVerification> findByStatus(VerificationStatus status, Pageable pageable);

	@Query("""
			    SELECT v FROM DoctorVerification v
			    JOIN v.doctor d
			    WHERE v.status = :status
			    AND (:keyword IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
			""")
	Page<DoctorVerification> searchByStatusAndDoctorName(
			@Param("status") VerificationStatus status,
			@Param("keyword") String keyword,
			Pageable pageable);

	boolean existsByDoctorIdAndStatus(Integer doctorId, VerificationStatus status);
}
