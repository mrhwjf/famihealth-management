package com.famihealth.family_health_management.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.famihealth.family_health_management.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
	List<Appointment> findByPatient_Id(Integer patientId);

	List<Appointment> findByDoctor_Id(Integer doctorId);

	List<Appointment> findByIssuer_Id(Integer issuerId);

	List<Appointment> findByStatus(String status);

	List<Appointment> findByAppointmentDatetimeBetween(LocalDateTime start, LocalDateTime end);
}
