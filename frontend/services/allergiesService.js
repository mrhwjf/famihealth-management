import { authHeaders } from './auth/loginService.js';

const ALLERGIES_URL = '/api/v1/allergies';
const FAMILY_MEMBERS_URL = '/api/v1/family-members';
const FAMILIES_URL = '/api/v1/families';

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

// GET /api/v1/allergies/{allergyId}
export async function getAllergyById(allergyId, sessionId) {
	const res = await fetch(`${ALLERGIES_URL}/${allergyId}`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// GET /api/v1/family-members/{memberId}/allergies
export async function listAllergiesByMember(memberId, sessionId) {
	const res = await fetch(`${FAMILY_MEMBERS_URL}/${memberId}/allergies`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// GET /api/v1/families/{familyId}/allergies
export async function listAllergiesByFamily(familyId, sessionId) {
	const res = await fetch(`${FAMILIES_URL}/${familyId}/allergies`, {
		method: 'GET',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

// POST /api/v1/family-members/{memberId}/allergies
// body: { allergens, notes? }
export async function createAllergy(memberId, body, sessionId) {
	const res = await fetch(`${FAMILY_MEMBERS_URL}/${memberId}/allergies`, {
		method: 'POST',
		headers: {
			...authHeaders(sessionId),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body ?? {}),
	});
	return handleResponse(res);
}

// PUT /api/v1/allergies/{allergyId}
export async function updateAllergyById(allergyId, body, sessionId) {
	const res = await fetch(`${ALLERGIES_URL}/${allergyId}`, {
		method: 'PUT',
		headers: {
			...authHeaders(sessionId),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body ?? {}),
	});
	return handleResponse(res);
}

// DELETE /api/v1/allergies/{allergyId}
export async function deleteAllergyById(allergyId, sessionId) {
	const res = await fetch(`${ALLERGIES_URL}/${allergyId}`, {
		method: 'DELETE',
		headers: authHeaders(sessionId),
	});
	return handleResponse(res);
}

export default {
	getAllergyById,
	listAllergiesByMember,
	listAllergiesByFamily,
	createAllergy,
	updateAllergyById,
	deleteAllergyById,
};

