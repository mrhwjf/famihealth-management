// Service: Doctor verification history
// GET /api/v1/admin/doctor-verifications/{doctorId}/history?page=...&size=...&sort=...
// Uses sessionId from sessionStorage and Vite proxy for /api

const BASE_URL = '';

import { authHeaders } from '../auth/loginService.js';

/**
 * Fetch verification history for a doctor (admin only).
 * @param {Object} params
 * @param {number|string} params.doctorId - Doctor ID (path)
 * @param {number} [params.page=0] - Page index
 * @param {number} [params.size=10] - Page size
 * @param {string[]} [params.sort] - Sort fields, e.g., ['reviewedAt,DESC']
 * @param {string} [params.headerName] - Deprecated; session header is fixed to 'X-Session-Id'
 * @returns {Promise<object>} Backend JSON response
 */
export async function getDoctorVerificationHistory({ doctorId, page = 0, size = 10, sort = [] }) {
  if (doctorId == null) throw new Error('Thiếu doctorId');

  const q = new URLSearchParams({ page: String(page), size: String(size) });
  if (Array.isArray(sort)) {
    // Multiple sort params supported: ?sort=a&sort=b
    sort.forEach(s => q.append('sort', String(s)));
  }

  const url = `${BASE_URL}/api/v1/admin/doctor-verifications/${encodeURIComponent(String(doctorId))}/history?${q.toString()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...authHeaders('X-Session-Id'),
      Accept: 'application/json',
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Lấy lịch sử thẩm định thất bại (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export default getDoctorVerificationHistory;
