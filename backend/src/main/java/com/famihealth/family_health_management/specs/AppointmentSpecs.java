package com.famihealth.family_health_management.specs;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.domain.Specification;

import com.famihealth.family_health_management.dto.request.appointment.AppointmentFilterRequest;
import com.famihealth.family_health_management.model.Appointment;
import com.famihealth.family_health_management.model.Appointment_;
import com.famihealth.family_health_management.model.FamilyMember_;
import com.famihealth.family_health_management.model.User_;

import jakarta.persistence.criteria.Predicate;

public class AppointmentSpecs {
	public static Specification<Appointment> byFilter(AppointmentFilterRequest filter, Set<Integer> patientIds) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			// Filter by patient IDs
			if (patientIds != null && !patientIds.isEmpty()) {
				predicates.add(root.get(Appointment_.patient).get(FamilyMember_.id).in(patientIds));
			}

			// Keyword search with metamodel
			if (filter.getField() != null && filter.getKeyword() != null && !filter.getKeyword().trim().isEmpty()) {
				String pattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
				switch (filter.getField()) {
					case "patientName":
						predicates.add(cb.like(
								cb.lower(root.get(Appointment_.patient).get(FamilyMember_.name)),
								pattern));
						break;
					case "location":
						predicates.add(cb.like(
								cb.lower(root.get(Appointment_.location)),
								pattern));
						break;
					case "notes":
						predicates.add(cb.like(
								cb.lower(root.get(Appointment_.notes)),
								pattern));
						break;
				}
			}

			// Filter by doctor
			if (filter.getDoctorId() != null) {
				predicates.add(cb.equal(
						root.get(Appointment_.doctor).get(User_.id),
						filter.getDoctorId()));
			}

			// Filter by date range with metamodel
			if (filter.getStartDate() != null && filter.getEndDate() != null) {
				try {
					LocalDate start = LocalDate.parse(filter.getStartDate());
					LocalDate end = LocalDate.parse(filter.getEndDate());

					LocalDateTime startDateTime = start.atStartOfDay();
					LocalDateTime endDateTime = end.atTime(23, 59, 59);

					predicates.add(cb.between(
							root.get(Appointment_.appointmentDatetime),
							startDateTime,
							endDateTime));
				} catch (DateTimeParseException e) {
					// Log or handle invalid date format
					System.err.println("Invalid date format: " + e.getMessage());
				}
			}

			// Filter by appointment status with metamodel
			if (filter.getStatus() != null) {
				predicates.add(cb.equal(
						root.get(Appointment_.status),
						filter.getStatus()));
			}

			return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
		};
	}
}
