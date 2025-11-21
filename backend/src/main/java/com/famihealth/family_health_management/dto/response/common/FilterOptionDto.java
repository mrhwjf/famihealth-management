package com.famihealth.family_health_management.dto.response.common;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterOptionDto {
	private List<DropdownFilterOption> dropdowns;
	private List<BooleanFilterOption> booleans;
	private List<DateRangeFilterOption> dateRanges;
	private List<SearchableFieldOption> searchableFields;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class DropdownFilterOption {
		private String field;
		private String label;
		private List<DropdownOption> options;
		private boolean multiSelect;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class DropdownOption {
		private Object value;
		private String label;
		private String description;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class BooleanFilterOption {
		private String field;
		private String label;
		private Boolean defaultValue;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class DateRangeFilterOption {
		private String field;
		private String label;
		private String dateFormat;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class SearchableFieldOption {
		private String field;
		private String label;
		private String placeholder;
	}
}
