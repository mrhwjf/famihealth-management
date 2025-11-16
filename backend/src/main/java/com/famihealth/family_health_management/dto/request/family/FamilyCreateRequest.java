package com.famihealth.family_health_management.dto.request.family;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyCreateRequest {
	@NotNull
	private Integer creatorId;

	@Size(max = 255)
	private String name;

	@Size(max = 255)
	private String address;

	@Size(max = 50)
	private String phone;
}
