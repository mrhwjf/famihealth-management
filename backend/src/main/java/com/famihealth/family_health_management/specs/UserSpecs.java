package com.famihealth.family_health_management.specs;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

import com.famihealth.family_health_management.dto.request.user.UserFilterRequest;
import com.famihealth.family_health_management.model.Role;
import com.famihealth.family_health_management.model.Role_;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.model.User_;

public class UserSpecs {

	public static Specification<User> filter(UserFilterRequest filter) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			// Keyword search
			if (filter.getField() != null && filter.getKeyword() != null) {
				String pattern = "%" + filter.getKeyword().toLowerCase() + "%";
				switch (filter.getField()) {
					case "name":
						predicates.add(cb.like(cb.lower(root.get(User_.name)), pattern));
						break;
					case "email":
						predicates.add(cb.like(cb.lower(root.get(User_.email)), pattern));
						break;
					case "phone":
						predicates.add(cb.like(cb.lower(root.get(User_.phone)), pattern));
						break;
				}
			}

			// Locked filter
			if (filter.getLocked() != null) {
				predicates.add(cb.equal(root.get(User_.locked), filter.getLocked()));
			}

			// Role filter
			if (filter.getRoleId() != null) {
				Join<User, Role> roleJoin = root.join(User_.role, JoinType.INNER);
				predicates.add(cb.equal(roleJoin.get(Role_.id), filter.getRoleId()));
			}

			// If no predicates, return true (no filter)
			if (predicates.isEmpty()) {
				return cb.conjunction(); // always true
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}
}
