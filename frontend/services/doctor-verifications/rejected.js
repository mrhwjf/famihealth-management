// Danh sách hồ sơ bác sĩ bị từ chối
// GET /api/v1/admin/doctor-verifications/rejected?pageable.page=0&pageable.size=10&pageable.sort=reviewedAt,DESC

import { authHeaders } from '../auth/loginService.js';

const BASE_URL = '/api/v1/admin/doctor-verifications';

export default async function getRejectedVerifications({ page = 0, size = 10, sort = ['reviewedAt,DESC'], headerName = 'X-Session-Id' } = {}) {
  const params = new URLSearchParams();
  params.append('pageable.page', page);
  params.append('pageable.size', size);
  (Array.isArray(sort) ? sort : [sort]).filter(Boolean).forEach(s => params.append('pageable.sort', s));

  const url = `${BASE_URL}/rejected?${params.toString()}`;

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...authHeaders(headerName),
      Accept: '*/*',
    },
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data?.message || `HTTP ${resp.status}`);
  }
  return data;
}
