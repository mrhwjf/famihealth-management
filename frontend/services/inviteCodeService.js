// Invite Code Service: API quản lý mã mời tham gia gia đình và trạng thái kích hoạt
// Swagger endpoints:
// - POST /api/v1/families/{familyId}/invite-code/regenerate   – Tạo lại mã mời
// - POST /api/v1/families/{familyId}/invite-code/deactivate   – Hủy kích hoạt mã mời
// - POST /api/v1/families/{familyId}/invite-code/activate     – Kích hoạt lại mã mời
// - GET  /api/v1/families/{familyId}/invite-code              – Lấy mã mời hiện tại
// - GET  /api/v1/families/{familyId}/invite-code/validate     – Kiểm tra mã mời

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/families';

async function handleResponse(resp) {
  const ct = resp.headers.get('content-type') || '';
  let data;
  if (ct.includes('application/json')) {
    data = await resp.json().catch(() => ({}));
  } else {
    const text = await resp.text().catch(() => '');
    data = text ? { message: text } : {};
  }
  if (!resp.ok) {
    throw new Error(data?.message || `HTTP ${resp.status}`);
  }
  return data;
}

/**
 * POST /api/v1/families/{familyId}/invite-code/regenerate
 * Tạo lại mã mời mới cho gia đình
 */
export async function regenerateInviteCode({ familyId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/invite-code/regenerate`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * POST /api/v1/families/{familyId}/invite-code/deactivate
 * Hủy kích hoạt mã mời
 */
export async function deactivateInviteCode({ familyId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/invite-code/deactivate`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * POST /api/v1/families/{familyId}/invite-code/activate
 * Kích hoạt lại mã mời
 */
export async function activateInviteCode({ familyId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/invite-code/activate`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * GET /api/v1/families/{familyId}/invite-code
 * Lấy mã mời hiện tại của gia đình
 * Response: { id, familyId, code, updatedAt, active }
 */
export async function getInviteCode({ familyId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/invite-code`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * GET /api/v1/families/{familyId}/invite-code/validate
 * Kiểm tra mã mời có hợp lệ hay không
 * @param {number} familyId - ID gia đình
 * @param {string} code - Mã mời cần kiểm tra (query param)
 * Response: { data: true/false }
 */
export async function validateInviteCode({ familyId, code, headerName = 'X-Session-Id' }) {
  const params = new URLSearchParams();
  params.append('code', code);
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/invite-code/validate?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

export default {
  regenerateInviteCode,
  deactivateInviteCode,
  activateInviteCode,
  getInviteCode,
  validateInviteCode,
};
