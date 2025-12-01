package com.famihealth.family_health_management.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.famihealth.family_health_management.dto.request.vaccination_record.VaccinationRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.vaccination_record.VaccinationRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.vaccination_record.VaccinationRecordDto;
import com.famihealth.family_health_management.model.VaccinationRecord;

@Mapper(componentModel = "spring")
public interface VaccinationRecordMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "familyMember", ignore = true)
	@Mapping(target = "vaccine", ignore = true)
	VaccinationRecord toEntity(VaccinationRecordCreateRequest request);

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "familyMember", ignore = true)
	@Mapping(target = "vaccine", ignore = true)
	void updateEntityFromDto(VaccinationRecordUpdateRequest request, @MappingTarget VaccinationRecord entity);

	@Mapping(target = "familyMemberId", source = "familyMember.id")
	@Mapping(target = "familyMemberName", source = "familyMember.name")
	@Mapping(target = "vaccineId", source = "vaccine.id")
	@Mapping(target = "vaccineName", source = "vaccine.name")
	VaccinationRecordDto toDto(VaccinationRecord entity);
}
