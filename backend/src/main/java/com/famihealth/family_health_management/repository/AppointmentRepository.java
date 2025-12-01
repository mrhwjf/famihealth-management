package com.famihealth.family_health_management.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.famihealth.family_health_management.model.Appointment;

public interface AppointmentRepository
		extends JpaRepository<Appointment, Integer>, JpaSpecificationExecutor<Appointment> {
	List<Appointment> findByPatient_Id(Integer patientId);

	List<Appointment> findByDoctor_Id(Integer doctorId);

	List<Appointment> findByIssuer_Id(Integer issuerId);

	List<Appointment> findByStatus(String status);

	List<Appointment> findByAppointmentDatetimeBetween(LocalDateTime start, LocalDateTime end);

	Set<Integer> findPatientIdsByDoctorId(Integer doctorId);

	@Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
			"AND YEAR(a.appointmentDatetime) = :year " +
			"AND MONTH(a.appointmentDatetime) = :month")
	List<Appointment> findByPatientAndMonth(
			@Param("patientId") Integer patientId,
			@Param("year") int year,
			@Param("month") int month);

}
