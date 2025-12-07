// Doctors Service: tạo hồ sơ bác sĩ theo Swagger
// POST /api/v1/doctors
// Body JSON dạng tối thiểu (theo DTO backend):
// {
//   "user": { "roleId": number, "password": string, "name": string, "phone": string, "email": string },
//   "doctorProfile": { "facilityId": number, "specializationId": number, "licenseNumber": string, "certificateFileUrl": string }
// }

import { authHeaders } from './auth/loginService.js';

const BASE_URL = '/api/v1/doctors';

function buildPageableWithPrefix(prefix = 'pageable.', { page = 0, size = 10, sort = [] } = {}) {
  const params = new URLSearchParams();
  params.append(`${prefix}page`, page);
  params.append(`${prefix}size`, size);
  (Array.isArray(sort) ? sort : [sort])
    .filter(Boolean)
    .forEach((s) => params.append(`${prefix}sort`, s));
  return params;
}

async function handleResponse(resp) {
  // cố gắng parse JSON, nếu thất bại thì lấy text để hiển thị lỗi rõ ràng
  let data;
  try {
    data = await resp.json();
  } catch {
    const text = await resp.text().catch(() => '');
    data = text ? { message: text } : {};
  }
  if (!resp.ok) {
    const msg = data?.message || `HTTP ${resp.status}`;
    // Log chi tiết để hỗ trợ debug nhanh
    console.error('DoctorsService error:', {
      status: resp.status,
      statusText: resp.statusText,
      body: data,
    });
    throw new Error(msg);
  }
  return data;
}

/**
 * Tạo mới hồ sơ bác sĩ
 * @param {Object} params
 * @param {Object} params.user - Thông tin user (bác sĩ)
 * @param {number} params.user.roleId - ID vai trò DOCTOR
 * @param {string} params.user.password - Mật khẩu ban đầu
 * @param {string} params.user.name - Họ tên
 * @param {string} params.user.phone - Số điện thoại
 * @param {string} params.user.email - Email
 * @param {string|null} [params.user.profileUrl] - Ảnh hồ sơ (tuỳ chọn) — sẽ bỏ nếu null
 * @param {Object} params.doctorProfile - Hồ sơ hành nghề
 * @param {number} params.doctorProfile.facilityId - Cơ sở y tế
 * @param {number} params.doctorProfile.specializationId - Chuyên khoa
 * @param {string} params.doctorProfile.licenseNumber - Số giấy phép
 * @param {string} params.doctorProfile.certificateFileUrl - URL chứng chỉ
 * @returns {Promise<Object>} JSON response từ backend
 */
export async function createDoctor({ user, doctorProfile }) {
  if (!user || !doctorProfile) throw new Error('Thiếu dữ liệu user hoặc doctorProfile');
  if (user.roleId == null) throw new Error('Thiếu user.roleId (DOCTOR role id)');
  if (!user.password) throw new Error('Thiếu mật khẩu (password)');
  if (!user.name) throw new Error('Thiếu họ tên (name)');
  if (!user.phone) throw new Error('Thiếu số điện thoại (phone)');
  if (!user.email) throw new Error('Thiếu email');
  if (!doctorProfile.licenseNumber) throw new Error('Thiếu licenseNumber');
  if (doctorProfile.facilityId == null || doctorProfile.facilityId === '') throw new Error('Thiếu facilityId');
  if (doctorProfile.specializationId == null || doctorProfile.specializationId === '') throw new Error('Thiếu specializationId');
  if (!doctorProfile.certificateFileUrl) throw new Error('Thiếu certificateFileUrl');

  // Chỉ gửi các field cần thiết; bỏ các field null để tránh lỗi 500 từ backend
  const body = {
    user: {
      roleId: Number(user.roleId),
      password: String(user.password),
      name: String(user.name),
      phone: String(user.phone),
      email: String(user.email),
      // Backend thường yêu cầu không null; mặc định unlocked
      locked: Boolean(user.locked ?? false),
      // Một số backend yêu cầu profileUrl không được null; gửi chuỗi rỗng nếu thiếu
      profileUrl: String(user.profileUrl ?? ''),
    },
    doctorProfile: {
      facilityId: Number(doctorProfile.facilityId),
      specializationId: Number(doctorProfile.specializationId),
      licenseNumber: String(doctorProfile.licenseNumber),
      certificateFileUrl: String(doctorProfile.certificateFileUrl),
      // Backend yêu cầu không null: mặc định false
      verified: Boolean(doctorProfile.verified ?? false),
    },
  };

  const resp = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      ...authHeaders('X-Session-Id'),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  return handleResponse(resp);
}

/**
 * Workaround when backend fails on single POST /doctors due to @MapsId.
 * Steps:
 * 1) Create user via POST /api/v1/users
 * 2) Update doctor via PUT /api/v1/doctors/{id} with doctorProfile
 */
export async function createDoctorTwoStep({ user, doctorProfile }) {
  // Step 1: create user
  const userPayload = {
    roleId: Number(user.roleId),
    password: String(user.password),
    name: String(user.name),
    phone: String(user.phone),
    email: String(user.email),
    profileUrl: String(user.profileUrl ?? ''),
  };
  const createUserResp = await fetch('/api/v1/users', {
    method: 'POST',
    headers: {
      ...authHeaders('X-Session-Id'),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(userPayload),
  });
  const userResult = await handleResponse(createUserResp);
  const newUserId = userResult?.data?.id;
  if (!newUserId) throw new Error('Không lấy được ID người dùng mới');

  // Step 2: attach doctor profile via PUT /doctors/{id}
  const updatePayload = {
    user: {
      roleId: Number(user.roleId),
      password: String(user.password),
      name: String(user.name),
      phone: String(user.phone),
      email: String(user.email),
      locked: Boolean(user.locked ?? false),
      profileUrl: String(user.profileUrl ?? ''),
    },
    doctorProfile: {
      facilityId: Number(doctorProfile.facilityId),
      specializationId: Number(doctorProfile.specializationId),
      licenseNumber: String(doctorProfile.licenseNumber),
      certificateFileUrl: String(doctorProfile.certificateFileUrl),
      verified: Boolean(doctorProfile.verified ?? false),
    },
  };

  const resp = await fetch(`${BASE_URL}/${Number(newUserId)}`, {
    method: 'PUT',
    headers: {
      ...authHeaders('X-Session-Id'),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(updatePayload),
  });
  return handleResponse(resp);
}

/**
 * Cập nhật hồ sơ bác sĩ theo id
 * PUT /api/v1/doctors/{id}
 * Yêu cầu cùng cấu trúc body như tạo mới; bỏ các field null
 * @param {number|string} id - ID bác sĩ
 * @param {{user:Object, doctorProfile:Object}} params - Dữ liệu cập nhật
 */
export async function updateDoctor(id, { user, doctorProfile }) {
  if (id == null || id === '') throw new Error('Thiếu id bác sĩ');
  if (!user || !doctorProfile) throw new Error('Thiếu dữ liệu user hoặc doctorProfile');
  if (user.roleId == null) throw new Error('Thiếu user.roleId (DOCTOR role id)');
  if (!user.password) throw new Error('Thiếu mật khẩu (password)');
  if (!user.name) throw new Error('Thiếu họ tên (name)');
  if (!user.phone) throw new Error('Thiếu số điện thoại (phone)');
  if (!user.email) throw new Error('Thiếu email');
  if (doctorProfile.facilityId == null || doctorProfile.facilityId === '') throw new Error('Thiếu facilityId');
  if (doctorProfile.specializationId == null || doctorProfile.specializationId === '') throw new Error('Thiếu specializationId');
  if (!doctorProfile.licenseNumber) throw new Error('Thiếu licenseNumber');
  if (!doctorProfile.certificateFileUrl) throw new Error('Thiếu certificateFileUrl');

  const body = {
    user: {
      roleId: Number(user.roleId),
      password: String(user.password),
      name: String(user.name),
      phone: String(user.phone),
      email: String(user.email),
      locked: Boolean(user.locked ?? false),
      // Luôn gửi profileUrl để tránh null nếu backend yêu cầu non-null
      profileUrl: String(user.profileUrl ?? ''),
    },
    doctorProfile: {
      facilityId: Number(doctorProfile.facilityId),
      specializationId: Number(doctorProfile.specializationId),
      licenseNumber: String(doctorProfile.licenseNumber),
      certificateFileUrl: String(doctorProfile.certificateFileUrl),
      // Luôn gửi boolean để tránh null
      verified: Boolean(doctorProfile.verified ?? false),
    },
  };

  const resp = await fetch(`${BASE_URL}/${Number(id)}`, {
    method: 'PUT',
    headers: {
      ...authHeaders('X-Session-Id'),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  return handleResponse(resp);
}

// Gửi hồ sơ thẩm định lần đầu
export async function submitVerification({ doctorId, data, headerName = 'X-Session-Id' }) {
  if (doctorId == null || doctorId === '') throw new Error('Thiếu doctorId');
  const url = `${BASE_URL}/${encodeURIComponent(doctorId)}/verification/submit`;
  const options = {
    method: 'POST',
    headers: {
      ...authHeaders(headerName),
      Accept: 'application/json',
    },
  };
  if (data !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }
  const resp = await fetch(url, options);
  return handleResponse(resp);
}

// Gửi lại hồ sơ sau khi bị từ chối
export async function resubmitVerification({ doctorId, data, headerName = 'X-Session-Id' }) {
  if (doctorId == null || doctorId === '') throw new Error('Thiếu doctorId');
  const url = `${BASE_URL}/${encodeURIComponent(doctorId)}/verification/resubmit`;
  const options = {
    method: 'POST',
    headers: {
      ...authHeaders(headerName),
      Accept: 'application/json',
    },
  };
  if (data !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }
  const resp = await fetch(url, options);
  return handleResponse(resp);
}

// Xem lần thẩm định gần nhất của một bác sĩ
export async function getLatestVerification({ doctorId, headerName = 'X-Session-Id' }) {
  if (doctorId == null || doctorId === '') throw new Error('Thiếu doctorId');
  const url = `${BASE_URL}/${encodeURIComponent(doctorId)}/verification/latest`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

// Xem lịch sử thẩm định (có phân trang)
export async function getVerificationHistory({
  doctorId,
  pageable = { page: 0, size: 10, sort: [] },
  headerName = 'X-Session-Id',
}) {
  if (doctorId == null || doctorId === '') throw new Error('Thiếu doctorId');
  const params = buildPageableWithPrefix('pageable.', {
    page: pageable?.page ?? 0,
    size: pageable?.size ?? 10,
    sort: pageable?.sort ?? [],
  });
  const url = `${BASE_URL}/${encodeURIComponent(doctorId)}/verification/history?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

// Xem chi tiết một lần thẩm định theo id
export async function getVerificationDetail({ verificationId, headerName = 'X-Session-Id' }) {
  if (verificationId == null || verificationId === '') throw new Error('Thiếu verificationId');
  const url = `${BASE_URL}/verification/${encodeURIComponent(verificationId)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...authHeaders(headerName), Accept: '*/*' },
  });
  return handleResponse(resp);
}

export default {
  createDoctor,
  updateDoctor,
  createDoctorTwoStep,
  submitVerification,
  resubmitVerification,
  getLatestVerification,
  getVerificationHistory,
  getVerificationDetail,
};
