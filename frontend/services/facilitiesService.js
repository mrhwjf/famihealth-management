import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/facilities';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson ? data?.message : res.statusText || String(data);
    throw new Error(message || `HTTP ${res.status}`);
  }
  return data;
}

function buildQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => usp.append(key, v));
    } else {
      usp.append(key, value);
    }
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

// GET /api/v1/facilities/{id}
export async function getFacilityById(id, sessionId) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    headers: authHeaders(sessionId),
  });
  return handleResponse(res);
}

// GET /api/v1/facilities with filters and pagination
// Swagger params: name (string), page (int), size (int), sort (array<string>) e.g. ["name,ASC"]
export async function listFacilities({ name, page = 0, size = 20, sort = ['name,ASC'] } = {}, sessionId) {
  const query = buildQuery({ name, page, size, sort });
  const res = await fetch(`${BASE_URL}${query}`, {
    method: 'GET',
    headers: authHeaders(sessionId),
  });
  return handleResponse(res);
}

// POST /api/v1/facilities
// body: { name }
export async function createFacility(body, sessionId) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      ...authHeaders(sessionId),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}

// PUT /api/v1/facilities/{id}
export async function updateFacilityById(id, body, sessionId) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(sessionId),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}

// DELETE /api/v1/facilities/{id}
export async function deleteFacilityById(id, sessionId) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(sessionId),
  });
  return handleResponse(res);
}

export default {
  getFacilityById,
  listFacilities,
  createFacility,
  updateFacilityById,
  deleteFacilityById,
};
