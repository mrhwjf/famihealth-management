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
@Table(name = "vaccination_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "family_member_id")
	private FamilyMember familyMember;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vacc_id")
	private Vaccine vaccine;

	@Column(name = "administered_date")
	private LocalDate administeredDate;

	@Column(name = "next_due_date")
	private LocalDate nextDueDate;

}
