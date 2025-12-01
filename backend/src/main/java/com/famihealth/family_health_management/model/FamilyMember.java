package com.famihealth.family_health_management.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.famihealth.family_health_management.enums.BloodType;
import com.famihealth.family_health_management.enums.Gender;
import com.famihealth.family_health_management.utils.BloodTypeConverter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(name = "blood_type", columnDefinition = "ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-')")
	@Convert(converter = BloodTypeConverter.class)
	private BloodType bloodType;

	@Column(name = "phone")
	private String phone;

	@Column(name = "profile_url")
	private String profileUrl;

	@OneToMany(mappedBy = "member", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
	private Set<MemberAccess> memberAccesses = new HashSet<>();
}
