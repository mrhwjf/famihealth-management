package com.famihealth.family_health_management.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.famihealth.family_health_management.dto.request.appointment.AppointmentCreateRequest;
import com.famihealth.family_health_management.dto.request.appointment.AppointmentUpdateRequest;
import com.famihealth.family_health_management.dto.response.appointment.AppointmentDto;
import com.famihealth.family_health_management.model.Appointment;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "issuer", ignore = true)
	@Mapping(target = "patient", ignore = true)
	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "status", ignore = true)
	Appointment toEntity(AppointmentCreateRequest request);

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "issuer", ignore = true)
	@Mapping(target = "patient", ignore = true)
	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "status", ignore = true)
	@Mapping(target = "medicalNotes", ignore = true)
	void updateEntityFromDto(AppointmentUpdateRequest request, @MappingTarget Appointment entity);

	@Mapping(target = "issuer", source = "issuer.name")
	@Mapping(target = "patient", source = "patient.name")
	@Mapping(target = "patientId", source = "patient.id")
	@Mapping(target = "doctor", source = "doctor.name")
	@Mapping(target = "doctorId", source = "doctor.id")
	@Mapping(target = "status", expression = "java(entity.getStatus() != null ? entity.getStatus().name() : null)")
	AppointmentDto toDto(Appointment entity);
}
