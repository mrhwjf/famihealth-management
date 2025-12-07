// Health Stat Service: API ghi nhận và theo dõi các chỉ số sức khỏe của thành viên
// Swagger endpoints:
// - GET    /api/v1/families/{familyId}/members/{memberId}/health-stats/{healthStatId}  – Xem chi tiết chỉ số sức khỏe
// - PUT    /api/v1/families/{familyId}/members/{memberId}/health-stats/{healthStatId}  – Cập nhật chỉ số sức khỏe
// - DELETE /api/v1/families/{familyId}/members/{memberId}/health-stats/{healthStatId}  – Xóa chỉ số sức khỏe
// - GET    /api/v1/families/{familyId}/members/{memberId}/health-stats                 – Danh sách chỉ số sức khỏe
// - POST   /api/v1/families/{familyId}/members/{memberId}/health-stats                 – Ghi nhận chỉ số sức khỏe

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
 * GET /api/v1/families/{familyId}/members/{memberId}/health-stats/{healthStatId}
 * Xem chi tiết chỉ số sức khỏe theo ID
 * Response: { id, familyMember, statsType, value, createdAt }
 */
export async function getHealthStatById({ familyId, memberId, healthStatId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/health-stats/${encodeURIComponent(healthStatId)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * PUT /api/v1/families/{familyId}/members/{memberId}/health-stats/{healthStatId}
 * Cập nhật chỉ số sức khỏe
 */
export async function updateHealthStat({ familyId, memberId, healthStatId, data, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/health-stats/${encodeURIComponent(healthStatId)}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(headerName), 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify(data ?? {}),
  });
  return handleResponse(resp);
}

/**
 * DELETE /api/v1/families/{familyId}/members/{memberId}/health-stats/{healthStatId}
 * Xóa chỉ số sức khỏe
 */
export async function deleteHealthStat({ familyId, memberId, healthStatId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/health-stats/${encodeURIComponent(healthStatId)}`;
  const resp = await fetch(url, {
    method: 'DELETE',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * GET /api/v1/families/{familyId}/members/{memberId}/health-stats
 * Danh sách chỉ số sức khỏe (phân trang, lọc theo bộ lọc)
 * Query params: statsTypeId, start, end, page (default 0), size (default 20), sort (default "createdAt,DESC")
 * Response: { items, page, size, totalElements, totalPages, hasNext, hasPrevious }
 */
export async function listHealthStats({
  familyId,
  memberId,
  statsTypeId,
  start,
  end,
  pageable = { page: 0, size: 20, sort: ['createdAt,DESC'] },
  headerName = 'X-Session-Id',
} = {}) {
  const params = new URLSearchParams();
  // Optional filters
  if (statsTypeId !== undefined && statsTypeId !== null && statsTypeId !== '') {
    params.append('statsTypeId', statsTypeId);
  }
  if (start !== undefined && start !== null && start !== '') {
    params.append('start', start);
  }
  if (end !== undefined && end !== null && end !== '') {
    params.append('end', end);
  }
  // Pagination params
  params.append('page', pageable?.page ?? 0);
  params.append('size', pageable?.size ?? 20);
  (Array.isArray(pageable?.sort) ? pageable.sort : [pageable?.sort])
    .filter(Boolean)
    .forEach((s) => params.append('sort', s));

  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/health-stats?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

/**
 * POST /api/v1/families/{familyId}/members/{memberId}/health-stats
 * Ghi nhận chỉ số sức khỏe mới
 */
export async function createHealthStat({ familyId, memberId, data, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberId)}/health-stats`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { ...authHeaders(headerName), 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify(data ?? {}),
  });
  return handleResponse(resp);
}

export default {
  getHealthStatById,
  updateHealthStat,
  deleteHealthStat,
  listHealthStats,
  createHealthStat,
};
