package com.famihealth.family_health_management.utils;

import com.famihealth.family_health_management.enums.BloodType;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class BloodTypeConverter implements AttributeConverter<BloodType, String> {

	@Override
	public String convertToDatabaseColumn(BloodType attribute) {
		return attribute != null ? attribute.getSymbol() : null;
	}

	@Override
	public BloodType convertToEntityAttribute(String dbData) {
		return dbData != null ? BloodType.fromSymbol(dbData) : null;
	}
}
