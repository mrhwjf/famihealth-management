package com.famihealth.family_health_management.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum BloodType {
	A_POS("A+"), A_NEG("A-"),
	B_POS("B+"), B_NEG("B-"),
	AB_POS("AB+"), AB_NEG("AB-"),
	O_POS("O+"), O_NEG("O-");

	private final String symbol;

	BloodType(String symbol) {
		this.symbol = symbol;
	}

	public String getSymbol() {
		return symbol;
	}

	public static BloodType fromSymbol(String symbol) {
		for (BloodType type : values()) {
			if (type.symbol.equals(symbol))
				return type;
		}
		throw new IllegalArgumentException("Unknown blood type: " + symbol);
	}

	@JsonValue
	public String toJson() {
		return symbol;
	}
}
