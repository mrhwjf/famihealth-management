package com.famihealth.family_health_management.repository;

import com.famihealth.family_health_management.model.MemberAccess;
import com.famihealth.family_health_management.model.MemberAccessId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MemberAccessRepository extends JpaRepository<MemberAccess, MemberAccessId> {
	List<MemberAccess> findByMemberId(Integer memberId);

	List<MemberAccess> findByDoctorId(Integer doctorId);

	void deleteByMemberIdAndDoctorId(Integer memberId, Integer doctorId);

	boolean existsByMemberIdAndDoctorId(Integer memberId, Integer doctorId);
}
