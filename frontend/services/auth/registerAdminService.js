// Service: Register Admin
// Calls POST /api/v1/auth/register/admin, stores sessionId in sessionStorage

const BASE_URL = ''; // use Vite proxy: /api -> backend

export const getSessionId = () => sessionStorage.getItem('sessionId');
export const setSessionId = (sid) => sid && sessionStorage.setItem('sessionId', sid);

export async function registerAdmin(payload) {
  const url = `${BASE_URL}/api/v1/auth/register/admin`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || `Đăng ký quản trị thất bại (${res.status})`;
    throw new Error(message);
  }

  const sessionId = data?.data?.sessionId || data?.data?.session?.sessionId;
  if (sessionId) {
    setSessionId(sessionId);
  }

  return data;
}

export default registerAdmin;