// Auth Services Index
// Export tất cả các auth services từ thư mục này
// Swagger endpoints (7 endpoints):
// 1. POST /api/v1/auth/login                    – loginService
// 2. POST /api/v1/auth/logout                   – logoutService
// 3. POST /api/v1/auth/register/admin           – registerAdminService
// 4. POST /api/v1/auth/register/doctor          – registerDoctorService
// 5. POST /api/v1/auth/register/family          – registerFamilyService
// 6. POST /api/v1/auth/request-password-reset   – resetPassService
// 7. POST /api/v1/auth/reset-password           – resetPassService

// Login
export {
  login,
  getSessionId,
  setSessionId,
  clearSessionId,
  authHeaders,
} from './loginService.js';

// Logout
export { logout } from './logoutService.js';

// Register Admin
export { registerAdmin } from './registerAdminService.js';

// Register Doctor
export { registerDoctor } from './registerDoctorService.js';

// Register Family
export { registerFamily } from './registerFamilyService.js';

// Reset Password
export { requestPasswordReset, resetPassword } from './resetPassService.js';
