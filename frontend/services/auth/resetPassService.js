// Reset Password Service
// Implements the two endpoints shown in Swagger:
// - POST /api/v1/auth/request-password-reset { email }
// - POST /api/v1/auth/reset-password { email, otp, newPassword }

const BASE = '/api/v1/auth';

async function handleResponse(resp) {
  let data;
  try {
    data = await resp.json();
  } catch {
    const text = await resp.text().catch(() => '');
    data = text ? { message: text } : {};
  }
  if (!resp.ok) {
    const msg = data?.message || `HTTP ${resp.status}`;
    console.error('ResetPassService error:', { status: resp.status, body: data });
    throw new Error(msg);
  }
  return data;
}

export async function requestPasswordReset(email) {
  if (!email) throw new Error('Vui lòng nhập email');
  const resp = await fetch(`${BASE}/request-password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email: String(email) }),
  });
  return handleResponse(resp);
}

export async function resetPassword({ email, otp, newPassword }) {
  if (!email) throw new Error('Thiếu email');
  if (!otp) throw new Error('Thiếu mã OTP');
  if (!newPassword) throw new Error('Thiếu mật khẩu mới');
  const resp = await fetch(`${BASE}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: String(email),
      otp: String(otp),
      newPassword: String(newPassword),
    }),
  });
  return handleResponse(resp);
}

export default { requestPasswordReset, resetPassword };
