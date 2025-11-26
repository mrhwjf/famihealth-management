package com.famihealth.family_health_management.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_record.MedicalRecordUpdateRequest;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordDetailDto;
import com.famihealth.family_health_management.dto.response.medical_record.MedicalRecordSummaryDto;
import com.famihealth.family_health_management.model.MedicalRecord;

@Mapper(componentModel = "spring", uses = { FamilyMemberMapper.class, UserMapper.class, FacilityMapper.class,
		MedicalDocumentMapper.class })
public interface MedicalRecordMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "familyMember", ignore = true)
	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "facility", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	@Mapping(target = "documents", ignore = true)
	MedicalRecord toEntity(MedicalRecordCreateRequest request);

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "familyMember", ignore = true)
	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "facility", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	@Mapping(target = "documents", ignore = true)
	void updateEntityFromDto(MedicalRecordUpdateRequest request, @MappingTarget MedicalRecord entity);

	@Mapping(target = "familyMember", ignore = true)
	@Mapping(target = "doctor", ignore = true)
	@Mapping(target = "facilityId", source = "facility.id")
	MedicalRecordSummaryDto toSummaryDto(MedicalRecord entity);

	@Mapping(target = "familyMember", source = "familyMember.name")
	@Mapping(target = "doctor", source = "doctor.name")
	@Mapping(target = "facility", source = "facility.name")
	@Mapping(target = "documents", source = "documents")
	MedicalRecordDetailDto toDetailDto(MedicalRecord entity);
}
