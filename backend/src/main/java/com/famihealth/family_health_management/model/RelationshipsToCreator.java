package com.famihealth.family_health_management.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "relationships_to_creator")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelationshipsToCreator {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "relationship_name", nullable = false, unique = true)
	private String relationshipName;

	@Column(name = "description")
	private String description;

}
