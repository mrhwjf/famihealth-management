package com.famihealth.family_health_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.PrescriptionItem;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Integer> {
	List<PrescriptionItem> findByPrescription_Id(Integer prescriptionId);

	List<PrescriptionItem> findByDrug_Id(Integer drugId);
}
