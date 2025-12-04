// Users Service: gọi các API quản lý người dùng
// Dựa theo Swagger (đính kèm):
// - GET    /api/v1/users/{id}
// - PUT    /api/v1/users/{id}
// - DELETE /api/v1/users/{id}
// - GET    /api/v1/users              (tìm kiếm, có pageable)
// - POST   /api/v1/users              (tạo người dùng mới)
// - GET    /api/v1/users/{id}/form-data
// - GET    /api/v1/users/form-data
// - GET    /api/v1/users/filter-options

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/users';

function buildPageable({ page = 0, size = 10, sort = [] } = {}) {
  const params = new URLSearchParams();
  params.append('pageable.page', page);
  params.append('pageable.size', size);
  (Array.isArray(sort) ? sort : [sort])
    .filter(Boolean)
    .forEach((s) => params.append('pageable.sort', s));
  return params;
}

async function handleResponse(resp) {
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data?.message || `HTTP ${resp.status}`);
  }
  return data;
}

// Lấy chi tiết người dùng theo id
export async function getUserById({ id, headerName = 'X-Session-Id' }) {
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

// Cập nhật người dùng theo id
export async function updateUserById({ id, data, headerName = 'X-Session-Id' }) {
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

// Xóa người dùng theo id
export async function deleteUserById({ id, headerName = 'X-Session-Id' }) {
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

// Tìm kiếm người dùng với pageable + bộ lọc tuỳ chọn
// filters là object các cặp key=value, sẽ append vào query
export async function searchUsers({
  pageable = { page: 0, size: 10, sort: [] },
  filters = {},
  headerName = 'X-Session-Id',
} = {}) {
  const params = buildPageable({
    page: pageable?.page ?? 0,
    size: pageable?.size ?? 10,
    sort: pageable?.sort ?? [],
  });
  Object.entries(filters || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((itm) => params.append(k, itm));
      else params.append(k, v);
    });

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

// Tạo người dùng mới
export async function createUser({ data, headerName = 'X-Session-Id' }) {
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

// Lấy dữ liệu form để chỉnh sửa người dùng
export async function getUserEditFormData({ id, headerName = 'X-Session-Id' }) {
  if (id === undefined || id === null) throw new Error('id is required');
  const url = `${BASE_URL}/${encodeURIComponent(id)}/form-data`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...authHeaders(headerName),
      Accept: '*/*',
    },
  });
  return handleResponse(resp);
}

// Lấy dữ liệu form để tạo người dùng
export async function getUserCreateFormData({ headerName = 'X-Session-Id' } = {}) {
  const url = `${BASE_URL}/form-data`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...authHeaders(headerName),
      Accept: '*/*',
    },
  });
  return handleResponse(resp);
}

// Lấy tuỳ chọn bộ lọc người dùng
export async function getUserFilterOptions({ headerName = 'X-Session-Id' } = {}) {
  const url = `${BASE_URL}/filter-options`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...authHeaders(headerName),
      Accept: '*/*',
    },
  });
  return handleResponse(resp);
}

// Export kiểu default để tiện import tất cả
export default {
  getUserById,
  updateUserById,
  deleteUserById,
  searchUsers,
  createUser,
  getUserEditFormData,
  getUserCreateFormData,
  getUserFilterOptions,
};
