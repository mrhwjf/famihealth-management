package com.famihealth.family_health_management.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import jakarta.persistence.OneToOne;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_id")
	private Role role;

	@Column(name = "password_hash")
	private String passwordHash;

	@Column(name = "name")
	private String name;

	@Column(name = "phone", unique = true)
	private String phone;

	@Column(name = "email", unique = true)
	private String email;

	@Column(name = "profile_url")
	private String profileUrl;

	@Column(name = "created_at")
	@CreationTimestamp
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	@UpdateTimestamp
	private LocalDateTime updatedAt;

	@Column(name = "locked", nullable = false)
	@Builder.Default
	private Boolean locked = false;

	@OneToOne(mappedBy = "doctor", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	private DoctorProfile doctorProfile;

}
