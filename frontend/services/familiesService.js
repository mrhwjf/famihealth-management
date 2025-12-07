// Families Service: gọi các API gia đình theo Swagger
// - GET    /api/v1/families/{id}
// - GET    /api/v1/families           (tìm kiếm: field, keyword, page, size, sort)
// - GET    /api/v1/families/{familyId}/access/members
// - GET    /api/v1/families/me
// - GET    /api/v1/families/me/members

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/families';

function buildPageable({ page = 0, size = 10, sort = [] } = {}) {
	const params = new URLSearchParams();
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

// Xem chi tiết gia đình theo id
export async function getFamilyById({ id, headerName = 'X-Session-Id' }) {
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

// Tìm kiếm gia đình: field, keyword, page, size, sort
export async function searchFamilies({
	field,
	keyword,
	pageable = { page: 0, size: 10, sort: ['id,ASC'] },
	headerName = 'X-Session-Id',
} = {}) {
	const params = buildPageable({
		page: pageable?.page ?? 0,
		size: pageable?.size ?? 10,
		sort: pageable?.sort ?? [],
	});

	if (field !== undefined && field !== null && field !== '') {
		params.append('field', field);
	}
	if (keyword !== undefined && keyword !== null && keyword !== '') {
		params.append('keyword', keyword);
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

// Danh sách quyền truy cập thành viên cho một gia đình
export async function getFamilyAccessMembers({ familyId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/access/members`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Tạo gia đình
export async function createFamily({ data, headerName = 'X-Session-Id' }) {
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

// Cập nhật gia đình theo id
export async function updateFamilyById({ id, data, headerName = 'X-Session-Id' }) {
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

// Xóa gia đình theo id
export async function deleteFamilyById({ id, headerName = 'X-Session-Id' }) {
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

// Thêm người dùng vào gia đình
export async function addUserToFamily({ familyId, userId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (userId === undefined || userId === null) throw new Error('userId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/access/users/${encodeURIComponent(userId)}`;
	const resp = await fetch(url, {
		method: 'POST',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Xóa người dùng khỏi gia đình
export async function removeUserFromFamily({ familyId, userId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (userId === undefined || userId === null) throw new Error('userId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/access/users/${encodeURIComponent(userId)}`;
	const resp = await fetch(url, {
		method: 'DELETE',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Xem chi tiết gia đình của tôi
export async function getMyFamily({ headerName = 'X-Session-Id' } = {}) {
	const url = `${BASE_URL}/me`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Danh sách thành viên gia đình của tôi
export async function getMyFamilyMembers({ headerName = 'X-Session-Id' } = {}) {
	const url = `${BASE_URL}/me/members`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

export default {
	getFamilyById,
	searchFamilies,
	getFamilyAccessMembers,
	getMyFamily,
	getMyFamilyMembers,
	createFamily,
	updateFamilyById,
	deleteFamilyById,
	addUserToFamily,
	removeUserFromFamily,
};

