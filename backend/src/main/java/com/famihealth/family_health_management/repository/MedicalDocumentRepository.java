package com.famihealth.family_health_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.MedicalDocument;

public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, Integer> {
	List<MedicalDocument> findByMedicalRecord_Id(Integer medicalRecordId);

	List<MedicalDocument> findByFileType(String fileType);
}
