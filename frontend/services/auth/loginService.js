// Simple login API service for frontend
// POST /api/v1/auth/login

// Resolve API base URL.
// Use relative path by default; Vite proxy handles '/api/*' in dev.
const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    || (typeof window !== 'undefined' && window.__API_BASE_URL__)
    || '';

const SESSION_KEY = 'sessionId';

export function getSessionId() {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionId(value) {
  try {
    sessionStorage.setItem(SESSION_KEY, value);
    console.log('[auth] saved sessionId:', value);
  } catch (e) {
    console.warn('[auth] unable to save sessionId:', e);
  }
}

export function clearSessionId() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    console.log('[auth] cleared sessionId');
  } catch (e) {
    console.warn('[auth] unable to clear sessionId:', e);
  }
}

/**
 * Login with phoneOrEmail and password.
 * @param {{ phoneOrEmail: string, password: string }} payload
 * @returns {Promise<object>} Parsed JSON response from backend
 */
export async function login(payload) {
  const url = `${BASE_URL}/api/v1/auth/login`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      phoneOrEmail: payload?.phoneOrEmail,
      password: payload?.password,
    }),
    credentials: 'include', // keep in case backend sets cookies
  });

  // Throw on non-2xx
  if (!res.ok) {
    const text = await res.text();
    console.error('Login failed:', res.status, text);
    throw new Error(`Login failed with status ${res.status}`);
  }

  const data = await res.json();
  console.log('Login success:', data); // Log success to console as requested

  // Persist sessionId to sessionStorage for subsequent API calls
  try {
    const sessionId = data?.data?.sessionId || data?.data?.session?.sessionId;
    if (sessionId) {
      setSessionId(sessionId);
    } else {
      console.warn('No sessionId in response payload');
    }
    // Also persist current user id if present for pages needing user context
    const userId = data?.data?.user?.id || data?.data?.id || data?.user?.id;
    if (userId) {
      try {
        sessionStorage.setItem('currentUserId', String(userId));
        console.log('[auth] saved currentUserId:', userId);
      } catch (e) {
        console.warn('Unable to persist currentUserId:', e);
      }
    }
    // Persist role to sessionStorage to avoid stale localStorage confusion
    const role = data?.data?.role || data?.role || data?.data?.user?.role;
    if (role) {
      try {
        sessionStorage.setItem('currentUserRole', String(role));
        console.log('[auth] saved currentUserRole:', role);
      } catch (e) {
        console.warn('Unable to persist currentUserRole:', e);
      }
    }
    // Clear legacy localStorage auth keys that may show stale roles
    try {
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
    } catch (e) {
      console.warn('Unable to clear legacy auth keys:', e);
    }
  } catch (e) {
    console.warn('Unable to persist sessionId:', e);
  }
  return data;
}

/**
 * Quick example to try in console or dev code:
 *
 * import { login } from './services/auth/loginService';
 * login({ phoneOrEmail: '0123456789', password: 'admin_hashed_password' })
 *   .then(console.log)
 *   .catch(console.error);
 */

/**
 * Build headers with sessionId for authenticated requests.
 * Header name defaults to 'X-Session-Id'.
 * @param {string} headerName
 * @returns {{[key:string]: string}}
 */
export function authHeaders(headerName = 'X-Session-Id') {
  const sid = getSessionId();
  return sid ? { [headerName]: sid } : {};
}

/**
 * Wrapper around fetch that automatically attaches sessionId header
 * if present in sessionStorage.
 * @param {string} url
 * @param {RequestInit} options
 * @param {string} headerName
 */
export async function fetchWithSession(url, options = {}, headerName = 'X-Session-Id') {
  const sid = getSessionId();
  const mergedHeaders = {
    ...(options.headers || {}),
    ...(sid ? { [headerName]: sid } : {}),
  };
  const resp = await fetch(url, { ...options, headers: mergedHeaders });
  return resp;
}
