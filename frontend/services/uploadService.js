// Upload Service: API upload chứng chỉ hành nghề bác sĩ
// Endpoint theo Swagger:
// POST /api/v1/doctor-profiles/{doctorId}/certificate/upload (multipart/form-data)

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/doctor-profiles';

async function handleResponse(resp) {
	// Cố gắng parse JSON; nếu lỗi, trả về text để dễ debug
	const contentType = resp.headers.get('content-type') || '';
	let data;
	if (contentType.includes('application/json')) {
		data = await resp.json().catch(() => ({}));
	} else {
		const text = await resp.text().catch(() => '');
		data = text ? { message: text } : {};
	}

	if (!resp.ok) {
		// Ưu tiên message từ backend
		const msg = (data && data.message) || `HTTP ${resp.status}`;
		throw new Error(msg);
	}
	return data;
}

/**
 * Upload chứng chỉ hành nghề (PDF hoặc hình) cho bác sĩ.
 * @param {{ doctorId: number|string, file: File, headerName?: string }} params
 * @returns {Promise<{ fileUrl: string }|any>} JSON từ backend, thường có { fileUrl }
 */
export async function uploadDoctorCertificate({ doctorId, file, headerName = 'X-Session-Id' }) {
	if (doctorId === undefined || doctorId === null) throw new Error('doctorId is required');
	if (!file) throw new Error('file is required');

	const url = `${BASE_URL}/${encodeURIComponent(doctorId)}/certificate/upload`;

	const formData = new FormData();
	// Theo Swagger, field name là 'file'
	formData.append('file', file, file.name);

	const resp = await fetch(url, {
		method: 'POST',
		headers: {
			// KHÔNG đặt 'Content-Type': trình duyệt sẽ tự set với boundary
			...authHeaders(headerName),
			Accept: '*/*',
		},
		body: formData,
	});
	return handleResponse(resp);
}

// Upload profile avatar for current user (multipart/form-data)
// Swagger: POST /api/v1/profile/upload -> { fileUrl: string }
export async function uploadProfileAvatar({ file, headerName = 'X-Session-Id' }) {
	const url = `/api/v1/profile/upload`;
	const form = new FormData();
	form.append('file', file);
	const resp = await fetch(url, { method: 'POST', headers: { ...authHeaders(headerName) }, body: form });
	const ct = resp.headers.get('content-type') || '';
	const data = ct.includes('application/json') ? await resp.json() : { message: await resp.text() };
	if (!resp.ok) throw new Error(data?.message || `HTTP ${resp.status}`);
	return data;
}

export default {
	uploadDoctorCertificate,
	uploadProfileAvatar,
// Upload medical document (multipart/form-data)
// Swagger: POST /api/v1/medical-documents/upload?medicalRecordId=ID -> { id, fileName, uploadDate, fileUrl }
export async function uploadMedicalDocument({ medicalRecordId, file, headerName = 'X-Session-Id' }) {
	if (medicalRecordId === undefined || medicalRecordId === null) throw new Error('medicalRecordId is required');
	if (!file) throw new Error('file is required');

	const qs = new URLSearchParams({ medicalRecordId: String(medicalRecordId) }).toString();
	const url = `/api/v1/medical-documents/upload?${qs}`;

	const form = new FormData();
	form.append('file', file, file.name);

	const resp = await fetch(url, {
		method: 'POST',
		headers: { ...authHeaders(headerName) },
		body: form,
	});
	const ct = resp.headers.get('content-type') || '';
	const data = ct.includes('application/json') ? await resp.json() : { message: await resp.text() };
	if (!resp.ok) throw new Error(data?.message || `HTTP ${resp.status}`);
	return data;
}

// Upload family member profile avatar (multipart/form-data)
// Swagger: POST /api/v1/family-members/{id}/profile/upload -> { fileUrl }
export async function uploadFamilyMemberAvatar({ id, file, headerName = 'X-Session-Id' }) {
	if (id === undefined || id === null) throw new Error('id is required');
	if (!file) throw new Error('file is required');

	const url = `/api/v1/family-members/${encodeURIComponent(id)}/profile/upload`;

	const form = new FormData();
	form.append('file', file, file.name);

	const resp = await fetch(url, {
		method: 'POST',
		headers: { ...authHeaders(headerName) },
		body: form,
	});
	const ct = resp.headers.get('content-type') || '';
	const data = ct.includes('application/json') ? await resp.json() : { message: await resp.text() };
	if (!resp.ok) throw new Error(data?.message || `HTTP ${resp.status}`);
	return data;
}

export default {
	uploadDoctorCertificate,
	uploadProfileAvatar,
	uploadMedicalDocument,
	uploadFamilyMemberAvatar,
};

