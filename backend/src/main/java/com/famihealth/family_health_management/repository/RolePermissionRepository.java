package com.famihealth.family_health_management.repository;

import com.famihealth.family_health_management.model.RolePermission;
import com.famihealth.family_health_management.model.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {
	List<RolePermission> findByRoleId(Integer roleId);

	List<RolePermission> findByPermissionId(Integer permissionId);

	void deleteByRoleIdAndPermissionId(Integer roleId, Integer permissionId);
}
