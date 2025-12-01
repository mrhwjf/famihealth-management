package com.famihealth.family_health_management.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "health_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthStat {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "family_member_id")
	private FamilyMember familyMember;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "stats_type_id")
	private HealthStatsType statsType;

	@Column(name = "value")
	private BigDecimal value;

	@Column(name = "created_at")
	@CreationTimestamp
	private LocalDateTime createdAt;

}
