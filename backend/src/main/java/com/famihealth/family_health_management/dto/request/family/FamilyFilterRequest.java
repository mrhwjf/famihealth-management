package com.famihealth.family_health_management.dto.request.family;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for filtering Family entities based on specific fields and keywords.
 * Used by Doctor roles to search and filter families.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyFilterRequest {
	private String field;
	private String keyword;
}
