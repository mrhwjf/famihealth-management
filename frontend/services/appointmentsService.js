// Appointments Service: gọi các API quản lý lịch hẹn
// Swagger endpoints:
// - GET    /api/v1/appointments/{appointmentId}
// - PUT    /api/v1/appointments/{appointmentId}
// - DELETE /api/v1/appointments/{appointmentId}
// - GET    /api/v1/appointments
// - POST   /api/v1/appointments
// - POST   /api/v1/appointments/{appointmentId}/complete
// - GET    /api/v1/appointments/form-data
// - GET    /api/v1/appointments/filter-options

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/appointments';

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

export async function getAppointmentById({ appointmentId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(appointmentId)}`;
  const resp = await fetch(url, { method: 'GET', headers: { ...authHeaders(headerName), Accept: '*/*' } });
  return handleResponse(resp);
}

export async function updateAppointment({ appointmentId, data, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(appointmentId)}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(headerName), 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify(data ?? {}),
  });
  return handleResponse(resp);
}

export async function deleteAppointment({ appointmentId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(appointmentId)}`;
  const resp = await fetch(url, { method: 'DELETE', headers: { ...authHeaders(headerName), Accept: '*/*' } });
  return handleResponse(resp);
}

export async function searchAppointments({ pageable = { page: 0, size: 10, sort: [] }, filters = {}, headerName = 'X-Session-Id' } = {}) {
  const params = new URLSearchParams();
  // Align with Swagger: use page, size, sort (not pageable.*)
  params.append('page', pageable?.page ?? 0);
  params.append('size', pageable?.size ?? 10);
  (Array.isArray(pageable?.sort) ? pageable.sort : [pageable?.sort])
    .filter(Boolean)
    .forEach((s) => params.append('sort', s));
  Object.entries(filters || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((itm) => params.append(k, itm));
      else params.append(k, v);
    });
  const url = `${BASE_URL}?${params.toString()}`;
  const resp = await fetch(url, { method: 'GET', headers: { ...authHeaders(headerName), Accept: '*/*' } });
  return handleResponse(resp);
}

export async function createAppointment({ data, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { ...authHeaders(headerName), 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify(data ?? {}),
  });
  return handleResponse(resp);
}

export async function completeAppointment({ appointmentId, headerName = 'X-Session-Id' }) {
  const url = `${BASE_URL}/${encodeURIComponent(appointmentId)}/complete`;
  const resp = await fetch(url, { method: 'POST', headers: { ...authHeaders(headerName), Accept: '*/*' } });
  return handleResponse(resp);
}

export async function getAppointmentFormData({ headerName = 'X-Session-Id' } = {}) {
  const url = `${BASE_URL}/form-data`;
  const resp = await fetch(url, { method: 'GET', headers: { ...authHeaders(headerName), Accept: '*/*' } });
  return handleResponse(resp);
}

export async function getAppointmentFilterOptions({ headerName = 'X-Session-Id' } = {}) {
  const url = `${BASE_URL}/filter-options`;
  const resp = await fetch(url, { method: 'GET', headers: { ...authHeaders(headerName), Accept: '*/*' } });
  return handleResponse(resp);
}

export default {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  searchAppointments,
  createAppointment,
  completeAppointment,
  getAppointmentFormData,
  getAppointmentFilterOptions,
};
