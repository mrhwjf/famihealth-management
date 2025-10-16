package com.famihealth.family_health_management.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "family_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMember {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "family_id")
	private Family family;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "relationship_to_creator_id")
	private RelationshipsToCreator relationshipToCreator;

	@Column(name = "name")
	private String name;

	@Column(name = "dob")
	private LocalDate dob;

	@Column(name = "gender")
	private String gender;

	@Column(name = "blood_type")
	private String bloodType;

	@Column(name = "phone")
	private String phone;
}
