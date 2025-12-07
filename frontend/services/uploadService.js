// Upload Service: API upload (doctor certificate, patient avatars, etc.)

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/doctor-profiles';

async function handleResponse(resp) {
    const contentType = resp.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
        data = await resp.json().catch(() => ({}));
    } else {
        const text = await resp.text().catch(() => '');
        data = text ? { message: text } : {};
    }

    if (!resp.ok) {
        const msg = data?.message || `HTTP ${resp.status}`;
        throw new Error(msg);
    }
    return data;
}

/**
 * Upload chứng chỉ hành nghề bác sĩ.
 */
export async function uploadDoctorCertificate({ doctorId, file, headerName = 'X-Session-Id' }) {
    if (doctorId === undefined || doctorId === null) throw new Error('doctorId is required');
    if (!file) throw new Error('file is required');

    const url = `${BASE_URL}/${encodeURIComponent(doctorId)}/certificate/upload`;

    const formData = new FormData();
    formData.append('file', file, file.name);

    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            ...authHeaders(headerName),
            Accept: '*/*'
        },
        body: formData
    });

    return handleResponse(resp);
}

/**
 * Upload avatar hồ sơ cá nhân người dùng hiện tại.
 */
export async function uploadProfileAvatar({ file, headerName = 'X-Session-Id' }) {
    if (!file) throw new Error('file is required');

    const url = `/api/v1/profile/upload`;

    const form = new FormData();
    form.append('file', file);

    const resp = await fetch(url, {
        method: 'POST',
        headers: { ...authHeaders(headerName) },
        body: form
    });

    const ct = resp.headers.get('content-type') || '';
    const data = ct.includes('application/json') ? await resp.json() : { message: await resp.text() };

    if (!resp.ok) throw new Error(data?.message || `HTTP ${resp.status}`);
    return data;
}

/**
 * Upload hồ sơ tài liệu y tế.
 */
export async function uploadMedicalDocument({ medicalRecordId, file, headerName = 'X-Session-Id' }) {
    if (medicalRecordId === undefined || medicalRecordId === null) throw new Error('medicalRecordId is required');
    if (!file) throw new Error('file is required');

    const qs = new URLSearchParams({ medicalRecordId: String(medicalRecordId) }).toString();
    const url = `/api/v1/medical-documents/upload?${qs}`;

    const form = new FormData();
    form.append('file', file, file.name);

    const resp = await fetch(url, {
        method: 'POST',
        headers: { ...authHeaders(headerName) },
        body: form
    });

    const ct = resp.headers.get('content-type') || '';
    const data = ct.includes('application/json') ? await resp.json() : { message: await resp.text() };

    if (!resp.ok) throw new Error(data?.message || `HTTP ${resp.status}`);
    return data;
}

/**
 * Upload avatar thành viên gia đình.
 */
export async function uploadFamilyMemberAvatar({ id, file, headerName = 'X-Session-Id' }) {
    if (id === undefined || id === null) throw new Error('id is required');
    if (!file) throw new Error('file is required');

    const url = `/api/v1/family-members/${encodeURIComponent(id)}/profile/upload`;

    const form = new FormData();
    form.append('file', file, file.name);

    const resp = await fetch(url, {
        method: 'POST',
        headers: { ...authHeaders(headerName) },
        body: form
    });

    const ct = resp.headers.get('content-type') || '';
    const data = ct.includes('application/json') ? await resp.json() : { message: await resp.text() };

    if (!resp.ok) throw new Error(data?.message || `HTTP ${resp.status}`);
    return data;
}

/**
 * Default export – clean
 */
export default {
    uploadDoctorCertificate,
    uploadProfileAvatar,
    uploadMedicalDocument,
    uploadFamilyMemberAvatar
};
