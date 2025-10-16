package com.famihealth.family_health_management.model;

import java.math.BigDecimal;

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
@Table(name = "health_stats_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthStatsType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "measurement_unit")
	private String measurementUnit;

	@Column(name = "name")
	private String name;

	@Column(name = "normal_range_min")
	private BigDecimal normalRangeMin;

	@Column(name = "normal_range_max")
	private BigDecimal normalRangeMax;

	@Column(name = "description")
	private String description;

}
