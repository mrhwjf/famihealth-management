// Vaccines Service: gọi các API quản lý vắc xin
// Theo Swagger (đính kèm):
// - GET    /api/v1/vaccines/{id}
// - PUT    /api/v1/vaccines/{id}
// - DELETE /api/v1/vaccines/{id}
// - GET    /api/v1/vaccines            (phân trang + lọc theo tên, có sort)
// - POST   /api/v1/vaccines            (thêm vắc xin)

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/vaccines';

function buildPageable({ page = 0, size = 10, sort = [] } = {}) {
	const params = new URLSearchParams();
	// Theo ảnh Swagger, các tham số là: name, page, size, sort (ví dụ: id,ASC)
	params.append('page', page);
	params.append('size', size);
	(Array.isArray(sort) ? sort : [sort])
		.filter(Boolean)
		.forEach((s) => params.append('sort', s));
	return params;
}

async function handleResponse(resp) {
	const data = await resp.json().catch(() => ({}));
	if (!resp.ok) {
		throw new Error(data?.message || `HTTP ${resp.status}`);
	}
	return data;
}

// Xem chi tiết vắc xin theo id
export async function getVaccineById({ id, headerName = 'X-Session-Id' }) {
	if (id === undefined || id === null) throw new Error('id is required');
	const url = `${BASE_URL}/${encodeURIComponent(id)}`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Cập nhật vắc xin theo id
export async function updateVaccineById({ id, data, headerName = 'X-Session-Id' }) {
	if (id === undefined || id === null) throw new Error('id is required');
	const url = `${BASE_URL}/${encodeURIComponent(id)}`;
	const resp = await fetch(url, {
		method: 'PUT',
		headers: {
			...authHeaders(headerName),
			'Content-Type': 'application/json',
			Accept: '*/*',
		},
		body: JSON.stringify(data ?? {}),
	});
	return handleResponse(resp);
}

// Xóa vắc xin theo id
export async function deleteVaccineById({ id, headerName = 'X-Session-Id' }) {
	if (id === undefined || id === null) throw new Error('id is required');
	const url = `${BASE_URL}/${encodeURIComponent(id)}`;
	const resp = await fetch(url, {
		method: 'DELETE',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Danh sách vắc xin: phân trang, lọc theo tên, sort
// filters: { name?: string }
export async function listVaccines({
	pageable = { page: 0, size: 10, sort: [] },
	filters = {},
	headerName = 'X-Session-Id',
} = {}) {
	const params = buildPageable({
		page: pageable?.page ?? 0,
		size: pageable?.size ?? 10,
		sort: pageable?.sort ?? [],
	});

	const { name } = filters || {};
	if (name !== undefined && name !== null && name !== '') {
		params.append('name', name);
	}

	const url = `${BASE_URL}?${params.toString()}`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Thêm vắc xin
export async function createVaccine({ data, headerName = 'X-Session-Id' }) {
	const url = `${BASE_URL}`;
	const resp = await fetch(url, {
		method: 'POST',
		headers: {
			...authHeaders(headerName),
			'Content-Type': 'application/json',
			Accept: '*/*',
		},
		body: JSON.stringify(data ?? {}),
	});
	return handleResponse(resp);
}

export default {
	getVaccineById,
	updateVaccineById,
	deleteVaccineById,
	listVaccines,
	createVaccine,
};

