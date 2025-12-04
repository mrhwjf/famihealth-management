// Danh sách hồ sơ bác sĩ đang chờ duyệt (pending)
// GET /api/v1/admin/doctor-verifications/pending?pageable.page=0&pageable.size=10&pageable.sort=submittedAt,DESC

import { authHeaders } from '../auth/loginService.js';

const BASE_URL = '/api/v1/admin/doctor-verifications';

export default async function getPendingVerifications({ page = 0, size = 10, sort = ['submittedAt,DESC'], headerName = 'X-Session-Id' } = {}) {
  const params = new URLSearchParams();
  params.append('pageable.page', page);
  params.append('pageable.size', size);
  (Array.isArray(sort) ? sort : [sort]).filter(Boolean).forEach(s => params.append('pageable.sort', s));

  const url = `${BASE_URL}/pending?${params.toString()}`;

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
