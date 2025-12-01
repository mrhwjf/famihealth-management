package com.famihealth.family_health_management.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfile {

	@Id
	private Integer doctorId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "facility_id")
	private Facility facility;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "specialization_id")
	private Specialization specialization;

	@Column(name = "license_number")
	private String licenseNumber;

	@Column(name = "certificate_file_url")
	private String certificateFileUrl;

	@Column(name = "verified", nullable = false)
	@Builder.Default
	private Boolean verified = false;

	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	@JoinColumn(name = "doctor_id")
	private User doctor;
}
