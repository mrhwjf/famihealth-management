package com.famihealth.family_health_management.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfile {

	@Id
	private Integer doctorId;

	@OneToOne
	@JoinColumn(name = "doctor_id", insertable = false, updatable = false)
	private User doctor;

	@Column(name = "license_number", nullable = false)
	private String licenseNumber;

	@Column(name = "certificate_file_url")
	private String certificateFileUrl;

	@Column(name = "is_verified", nullable = false)
	private Boolean isVerified = false;

}
