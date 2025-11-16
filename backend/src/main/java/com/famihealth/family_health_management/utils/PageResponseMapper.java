package com.famihealth.family_health_management.utils;

import java.util.function.Function;

import org.springframework.data.domain.Page;

import com.famihealth.family_health_management.dto.response.common.PageResponse;

public final class PageResponseMapper {
	private PageResponseMapper() {
	}

	public static <E, D> PageResponse<D> fromPage(Page<E> page, Function<E, D> mapper) {
		return PageResponse.<D>builder()
				.items(page.getContent().stream().map(mapper).toList())
				.page(page.getNumber())
				.size(page.getSize())
				.totalElements(page.getTotalElements())
				.totalPages(page.getTotalPages())
				.hasNext(page.hasNext())
				.hasPrevious(page.hasPrevious())
				.build();
	}
}
