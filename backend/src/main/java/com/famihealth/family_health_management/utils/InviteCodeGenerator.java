package com.famihealth.family_health_management.utils;

import java.security.SecureRandom;

/**
 * Utility class for generating family invite codes.
 */
public class InviteCodeGenerator {

	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private static final int CODE_LENGTH = 10; // adjust length for security
	private static final SecureRandom RANDOM = new SecureRandom();

	/**
	 * Generates a random invite code.
	 * 
	 * @return a random uppercase alphanumeric string
	 */
	public static String generateCode() {
		StringBuilder sb = new StringBuilder(CODE_LENGTH);
		for (int i = 0; i < CODE_LENGTH; i++) {
			int index = RANDOM.nextInt(CHARACTERS.length());
			sb.append(CHARACTERS.charAt(index));
		}
		return sb.toString();
	}
}
