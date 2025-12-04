// Service: Approve doctor verification
// POST /api/v1/admin/doctor-verifications/{doctorId}/approve?adminId=...&remarks=...
// Uses sessionId from sessionStorage and Vite proxy for /api

const BASE_URL = '';

import { authHeaders } from '../auth/loginService.js';

/**
 * Approve a doctor's verification dossier.
 * @param {Object} params
 * @param {number|string} params.doctorId - Doctor ID (path)
 * @param {number|string} params.adminId - Admin ID (query)
 * @param {string} [params.remarks] - Optional note
 * @param {string} [params.headerName] - Deprecated; session header is fixed to 'X-Session-Id'
 * @returns {Promise<object>} Backend JSON response
 */
export async function approveDoctorVerification({ doctorId, adminId, remarks = '' }) {
  if (doctorId == null) throw new Error('Thiếu doctorId');
  if (adminId == null) throw new Error('Thiếu adminId');

  const url = `${BASE_URL}/api/v1/admin/doctor-verifications/${encodeURIComponent(String(doctorId))}/approve`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...authHeaders('X-Session-Id'),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ adminId: String(adminId), remarks: String(remarks || '') }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Phê duyệt hồ sơ thất bại (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export default approveDoctorVerification;
