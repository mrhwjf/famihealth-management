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
@Table(name = "role_permissions")
@IdClass(RolePermissionId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolePermission {

	@Id
	@Column(name = "role_id")
	private Integer roleId;

	@Id
	@Column(name = "permission_id")
	private Integer permissionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_id", insertable = false, updatable = false)
	private Role role;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "permission_id", insertable = false, updatable = false)
	private Permission permission;
}
