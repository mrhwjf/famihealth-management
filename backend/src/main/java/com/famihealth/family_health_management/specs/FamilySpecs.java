package com.famihealth.family_health_management.specs;

import java.util.Collection;

import org.springframework.data.jpa.domain.Specification;

import com.famihealth.family_health_management.dto.request.family.FamilyFilterRequest;
import com.famihealth.family_health_management.model.Family;
import com.famihealth.family_health_management.model.Family_;

public class FamilySpecs {

	public static Specification<Family> byFilter(FamilyFilterRequest filter) {
		return (root, query, cb) -> {
			if (filter == null || filter.getField() == null || filter.getKeyword() == null) {
				return cb.conjunction(); // no filtering
			}

			String keyword = "%" + filter.getKeyword().trim().toLowerCase() + "%";

			switch (filter.getField()) {
				case Family_.NAME:
					return cb.like(cb.lower(root.get(Family_.NAME)), keyword);

				case Family_.ADDRESS:
					return cb.like(cb.lower(root.get(Family_.ADDRESS)), keyword);

				case Family_.PHONE:
					return cb.like(cb.lower(root.get(Family_.PHONE)), keyword);

				default:
					return cb.conjunction(); // unknown field, no filtering
			}
		};
	}

	public static Specification<Family> hasIds(Collection<Integer> familyIds) {
		return (root, query, cb) -> {
			if (familyIds == null || familyIds.isEmpty()) {
				return cb.disjunction();
			}
			return root.get(Family_.ID).in(familyIds);
		};
	}
}
