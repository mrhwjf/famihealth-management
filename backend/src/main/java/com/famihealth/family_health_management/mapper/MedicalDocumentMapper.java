package com.famihealth.family_health_management.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.famihealth.family_health_management.dto.request.medical_document.MedicalDocumentCreateRequest;
import com.famihealth.family_health_management.dto.request.medical_document.MedicalDocumentUpdateRequest;
import com.famihealth.family_health_management.dto.response.medical_document.MedicalDocumentDto;
import com.famihealth.family_health_management.model.MedicalDocument;

@Mapper(componentModel = "spring")
public interface MedicalDocumentMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "medicalRecord", ignore = true)
	@Mapping(target = "uploadDate", ignore = true)
	MedicalDocument toEntity(MedicalDocumentCreateRequest request);

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "medicalRecord", ignore = true)
	@Mapping(target = "uploadDate", ignore = true)
	void updateEntityFromDto(MedicalDocumentUpdateRequest request, @MappingTarget MedicalDocument entity);

	@Mapping(target = "uploadDate", source = "uploadDate")
	MedicalDocumentDto toDto(MedicalDocument entity);
}
