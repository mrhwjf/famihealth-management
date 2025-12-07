import { authHeaders } from './auth/loginService.js';

const VACCINE_RECORDS_URL = '/api/v1/vaccination-records';
const FAMILY_MEMBERS_URL = '/api/v1/family-members';

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

// GET /api/v1/vaccination-records/{recordId}
export async function getVaccinationRecordById(recordId, sessionId) {
	const res = await fetch(`${VACCINE_RECORDS_URL}/${recordId}`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// GET /api/v1/family-members/{memberId}/vaccination-records
export async function listVaccinationRecordsByMember(memberId, sessionId) {
	const res = await fetch(`${FAMILY_MEMBERS_URL}/${memberId}/vaccination-records`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// POST /api/v1/family-members/{memberId}/vaccination-records
// body: { vaccineId, administeredDate, nextDueDate? }
export async function createVaccinationRecord(memberId, body, sessionId) {
	const res = await fetch(`${FAMILY_MEMBERS_URL}/${memberId}/vaccination-records`, {
		method: 'POST',
		headers: {
			...authHeaders(sessionId),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body ?? {}),
	});
	return handleResponse(res);
}

// PUT /api/v1/vaccination-records/{recordId}
export async function updateVaccinationRecordById(recordId, body, sessionId) {
	const res = await fetch(`${VACCINE_RECORDS_URL}/${recordId}`, {
		method: 'PUT',
		headers: {
			...authHeaders(sessionId),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body ?? {}),
	});
	return handleResponse(res);
}

// DELETE /api/v1/vaccination-records/{recordId}
export async function deleteVaccinationRecordById(recordId, sessionId) {
	const res = await fetch(`${VACCINE_RECORDS_URL}/${recordId}`, {
		method: 'DELETE',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

export default {
	getVaccinationRecordById,
	listVaccinationRecordsByMember,
	createVaccinationRecord,
	updateVaccinationRecordById,
	deleteVaccinationRecordById,
};

