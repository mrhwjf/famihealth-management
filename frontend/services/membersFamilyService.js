// Members Family Service: gọi API thành viên gia đình theo Swagger
// - GET    /api/v1/families/{familyId}/members                (danh sách)
// - GET    /api/v1/families/{familyId}/members/{memberId}    (chi tiết)
// - GET    /api/v1/families/{familyId}/members/{memberId}/form-data (form edit)
// - GET    /api/v1/families/{familyId}/members/form-data     (form create)
// - POST   /api/v1/families/{familyId}/members               (tạo thành viên)
// - PUT    /api/v1/families/{familyId}/members/{memberId}    (cập nhật thành viên)
// - DELETE /api/v1/families/{familyId}/members/{memberId}/unlink-user   (huỷ liên kết người dùng)
// - DELETE /api/v1/families/{familyId}/members/{memberId}/unlink-doctor (huỷ liên kết bác sĩ)

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/families';

async function handleResponse(resp) {
	const data = await resp.json().catch(() => ({}));
	if (!resp.ok) {
		throw new Error(data?.message || `HTTP ${resp.status}`);
	}
	return data;
}

// Danh sách thành viên gia đình
export async function getFamilyMembers({ familyId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Chi tiết thành viên trong gia đình
export async function getFamilyMemberDetail({ familyId, memberId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (memberId === undefined || memberId === null) throw new Error('memberId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Form data chỉnh sửa thành viên
export async function getFamilyMemberEditFormData({ familyId, memberId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (memberId === undefined || memberId === null) throw new Error('memberId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/form-data`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Form data tạo thành viên
export async function getFamilyMemberCreateFormData({ familyId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/form-data`;
	const resp = await fetch(url, {
		method: 'GET',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Tạo thành viên gia đình
export async function createFamilyMember({ familyId, data, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members`;
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

// Cập nhật thành viên gia đình
export async function updateFamilyMember({ familyId, memberId, data, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (memberId === undefined || memberId === null) throw new Error('memberId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}`;
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

// Liên kết thành viên với người dùng
export async function linkUserToFamilyMember({ familyId, memberId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (memberId === undefined || memberId === null) throw new Error('memberId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/link-user`;
	const resp = await fetch(url, {
		method: 'POST',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Liên kết thành viên với bác sĩ theo dõi
export async function linkDoctorToFamilyMember({ familyId, memberId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (memberId === undefined || memberId === null) throw new Error('memberId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/link-doctor`;
	const resp = await fetch(url, {
		method: 'POST',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Xóa thành viên gia đình
export async function deleteFamilyMember({ familyId, memberId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (memberId === undefined || memberId === null) throw new Error('memberId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}`;
	const resp = await fetch(url, {
		method: 'DELETE',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Huỷ liên kết người dùng với thành viên
export async function unlinkUserFromFamilyMember({ familyId, memberId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (memberId === undefined || memberId === null) throw new Error('memberId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/unlink-user`;
	const resp = await fetch(url, {
		method: 'DELETE',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

// Huỷ liên kết bác sĩ với thành viên
export async function unlinkDoctorFromFamilyMember({ familyId, memberId, headerName = 'X-Session-Id' }) {
	if (familyId === undefined || familyId === null) throw new Error('familyId is required');
	if (memberId === undefined || memberId === null) throw new Error('memberId is required');
	const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/unlink-doctor`;
	const resp = await fetch(url, {
		method: 'DELETE',
		headers: {
			...authHeaders(headerName),
			Accept: '*/*',
		},
	});
	return handleResponse(resp);
}

export default {
	getFamilyMembers,
	getFamilyMemberDetail,
	getFamilyMemberEditFormData,
	getFamilyMemberCreateFormData,
	createFamilyMember,
	updateFamilyMember,
	linkUserToFamilyMember,
	linkDoctorToFamilyMember,
	deleteFamilyMember,
	unlinkUserFromFamilyMember,
	unlinkDoctorFromFamilyMember,
};
