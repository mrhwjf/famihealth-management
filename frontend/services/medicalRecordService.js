import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/medical-records';

async function handleResponse(res) {
	const contentType = res.headers.get('content-type') || '';
	const isJson = contentType.includes('application/json');
	const data = isJson ? await res.json() : await res.text();
	if (!res.ok) {
		const message = isJson ? data?.message : res.statusText || String(data);
		throw new Error(message || `HTTP ${res.status}`);
	}
	return data;
}

function buildQuery(params = {}) {
	const usp = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') return;
		if (Array.isArray(value)) {
			value.forEach((v) => usp.append(key, v));
		} else {
			usp.append(key, value);
		}
	});
	const qs = usp.toString();
	return qs ? `?${qs}` : '';
}

function buildPageableWithPrefix(prefix = 'pageable.', { page = 0, size = 20, sort = ['date,DESC'] } = {}) {
	const params = {};
	params[`${prefix}page`] = page;
	params[`${prefix}size`] = size;
	params[`${prefix}sort`] = sort;
	return params;
}

// GET /api/v1/medical-records/{id}
export async function getMedicalRecordById(id, sessionId) {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// GET /api/v1/medical-records/{id}/form-data
export async function getMedicalRecordEditFormData(id, sessionId) {
	const res = await fetch(`${BASE_URL}/${id}/form-data`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// GET /api/v1/medical-records/form-data
export async function getMedicalRecordCreateFormData(sessionId) {
	const res = await fetch(`${BASE_URL}/form-data`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// GET /api/v1/medical-records/family-member/{familyMemberId}
// query: pageable.page, pageable.size, pageable.sort (array<string>)
export async function listMedicalRecordsByFamilyMember(familyMemberId, pageable = { page: 0, size: 20, sort: ['date,DESC'] }, sessionId) {
	const params = buildPageableWithPrefix('pageable.', pageable);
	const query = buildQuery(params);
	const res = await fetch(`${BASE_URL}/family-member/${familyMemberId}${query}`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// POST /api/v1/medical-records
// body: { familyMemberId, doctorId, facilityId, date, diagnosis, treatment, followUpDate, documents? }
export async function createMedicalRecord(body, sessionId) {
	const res = await fetch(BASE_URL, {
		method: 'POST',
		headers: {
			...authHeaders(sessionId),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body ?? {}),
	});
	return handleResponse(res);
}

// PUT /api/v1/medical-records/{id}
export async function updateMedicalRecordById(id, body, sessionId) {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: 'PUT',
		headers: {
			...authHeaders(sessionId),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body ?? {}),
	});
	return handleResponse(res);
}

// DELETE /api/v1/medical-records/{id}
export async function deleteMedicalRecordById(id, sessionId) {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: 'DELETE',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

export default {
	getMedicalRecordById,
	getMedicalRecordEditFormData,
	getMedicalRecordCreateFormData,
	listMedicalRecordsByFamilyMember,
	createMedicalRecord,
	updateMedicalRecordById,
	deleteMedicalRecordById,
};

