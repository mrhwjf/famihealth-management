// Service: Register Family
// POST /api/v1/auth/register/family – Đăng ký tài khoản gia đình

const BASE_URL = ''; // use Vite proxy: /api -> backend

export const getSessionId = () => sessionStorage.getItem('sessionId');
export const setSessionId = (sid) => sid && sessionStorage.setItem('sessionId', sid);

/**
 * Đăng ký tài khoản gia đình
 * @param {object} payload - { name, phone, email, password, ... }
 * @returns {Promise<object>} Response: { sessionId, session, user }
 */
export async function registerFamily(payload) {
  const url = `${BASE_URL}/api/v1/auth/register/family`;
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
    const message = data?.message || `Đăng ký gia đình thất bại (${res.status})`;
    throw new Error(message);
  }

  // Store sessionId if returned
  const sessionId = data?.data?.sessionId || data?.data?.session?.sessionId;
  if (sessionId) {
    setSessionId(sessionId);
  }

  // Store userId if present
  const userId = data?.data?.user?.id;
  if (userId) {
    try {
      sessionStorage.setItem('currentUserId', String(userId));
    } catch (e) {
      console.warn('Unable to persist currentUserId:', e);
    }
  }

  return data;
}

export default registerFamily;
