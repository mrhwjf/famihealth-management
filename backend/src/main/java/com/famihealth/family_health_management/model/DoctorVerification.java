package com.famihealth.family_health_management.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.famihealth.family_health_management.enums.VerificationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctor_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorVerification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "doctor_id")
	private User doctor;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "admin_id")
	private User admin;

	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private VerificationStatus status; // PENDING, APPROVED, REJECTED

	@Column(name = "submitted_at", updatable = false)
	@CreationTimestamp
	private LocalDateTime submittedAt;

	@Column(name = "reviewed_at", nullable = true)
	private LocalDateTime reviewedAt;

	@Column(name = "remarks")
	private String remarks;

}
