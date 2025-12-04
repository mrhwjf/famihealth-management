// Logout API service for frontend
// POST /api/v1/auth/logout

// Resolve API base URL.
// Use relative path by default; Vite proxy will handle '/api/*' in dev.
const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    || (typeof window !== 'undefined' && window.__API_BASE_URL__)
    || '';

const SESSION_KEY = 'sessionId';

function getSessionId() {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function clearSessionId() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.warn('[auth] unable to clear sessionId:', e);
  }
}

/**
 * Logout current session using header 'X-Session-Id'.
 * Clears sessionId from sessionStorage on success.
 * @param {string} headerName Defaults to 'X-Session-Id' to match backend requirement.
 * @returns {Promise<object>} Parsed response JSON
 */
export async function logout(headerName = 'X-Session-Id') {
  const url = `${BASE_URL}/api/v1/auth/logout`;
  const sid = getSessionId();

  if (!sid) {
    console.warn('[auth] Không tìm thấy sessionId trong Session Storage, vẫn gửi yêu cầu logout.');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(sid ? { [headerName]: sid } : {}),
    },
    // no body required for logout
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Logout failed:', res.status, text);
    throw new Error(`Logout failed with status ${res.status}`);
  }

  const data = await res.json().catch(() => ({}));
  // Clear session locally after successful logout
  clearSessionId();
  console.log('Logout success:', data);
  return data;
}

/**
 * Quick check in console:
 * import { logout } from './services/auth/logoutService';
 * logout().then(console.log).catch(console.error);
 */
