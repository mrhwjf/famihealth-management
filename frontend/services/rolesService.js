// Roles Service: API quản trị danh sách vai trò và quyền truy cập
// Swagger endpoints:
// - GET    /api/v1/roles/{id}  – Xem chi tiết vai trò
// - PUT    /api/v1/roles/{id}  – Cập nhật vai trò
// - DELETE /api/v1/roles/{id}  – Xóa vai trò
// - GET    /api/v1/roles       – Danh sách vai trò (pageable + filter by name)
// - POST   /api/v1/roles       – Tạo vai trò

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/roles';

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
 * GET /api/v1/roles/{id}
 * Xem chi tiết vai trò theo ID
 * Response: { id, name, description }
 */
export async function getRoleById({ id, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(id)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * PUT /api/v1/roles/{id}
 * Cập nhật vai trò
 */
export async function updateRole({ id, data, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(id)}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(headerName), 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify(data ?? {}),
  });
  return handleResponse(resp);
}

/**
 * DELETE /api/v1/roles/{id}
 * Xóa vai trò
 */
export async function deleteRole({ id, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(id)}`;
  const resp = await fetch(url, {
    method: 'DELETE',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * GET /api/v1/roles
 * Danh sách vai trò (phân trang, lọc theo tên)
 * Query params: name, page (default 0), size (default 10), sort (default "id,ASC")
 * Response: { items, page, size, totalElements, totalPages, hasNext, hasPrevious }
 */
export async function listRoles({ name, pageable = { page: 0, size: 10, sort: ['id,ASC'] }, headerName = 'X-Session-Id' } = {}) {
  const params = new URLSearchParams();
  // Filter by name (optional)
  if (name !== undefined && name !== null && name !== '') {
    params.append('name', name);
  }
  // Pagination params
  params.append('page', pageable?.page ?? 0);
  params.append('size', pageable?.size ?? 10);
  (Array.isArray(pageable?.sort) ? pageable.sort : [pageable?.sort])
    .filter(Boolean)
    .forEach((s) => params.append('sort', s));

  const url = `${BASE_URL}?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * POST /api/v1/roles
 * Tạo vai trò mới
 */
export async function createRole({ data, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { ...authHeaders(headerName), 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify(data ?? {}),
  });
  return handleResponse(resp);
}

export default {
  getRoleById,
  updateRole,
  deleteRole,
  listRoles,
  createRole,
};
