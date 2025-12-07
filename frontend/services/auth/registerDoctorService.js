// Service: Register Doctor
// POST /api/v1/auth/register/doctor – Đăng ký tài khoản bác sĩ
// Request body: { user: {...}, doctorProfile: {...} }

const BASE_URL = ''; // use Vite proxy: /api -> backend

export const getSessionId = () => sessionStorage.getItem('sessionId');
export const setSessionId = (sid) => sid && sessionStorage.setItem('sessionId', sid);

/**
 * Đăng ký tài khoản bác sĩ
 * @param {object} payload - { user: { roleId, password, name, phone, email, profileUrl }, doctorProfile: { facilityId, specializationId, licenseNumber, certificateFileUrl, verified } }
 * @returns {Promise<object>} Response data
 */
export async function registerDoctor(payload) {
  const url = `${BASE_URL}/api/v1/auth/register/doctor`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || `Đăng ký bác sĩ thất bại (${res.status})`;
    throw new Error(message);
  }

  // Store sessionId if returned
  const sessionId = data?.data?.sessionId || data?.data?.session?.sessionId;
  if (sessionId) {
    setSessionId(sessionId);
  }

  return data;
}

export default registerDoctor;
