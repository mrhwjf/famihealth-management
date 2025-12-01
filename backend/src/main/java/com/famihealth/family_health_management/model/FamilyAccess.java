package com.famihealth.family_health_management.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "family_access")
@IdClass(FamilyAccessId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyAccess {

	@Id
	@Column(name = "family_id")
	private Integer familyId;

	@Id
	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "family_creator")
	private Boolean familyCreator;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "family_id", insertable = false, updatable = false)
	private Family family;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", insertable = false, updatable = false)
	private User user;
}
