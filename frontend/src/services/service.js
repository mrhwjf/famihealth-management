import api from './apiClient';

// Danh sách endpoint đơn giản để thử kết nối.
// Ưu tiên endpoint public và đơn giản
const PROBE_ENDPOINTS = [
  '/v1/vaccines',             // GET /api/v1/vaccines
  '/v1/roles',                // GET /api/v1/roles
  '/v1/health-stats-types',   // GET /api/v1/health-stats-types
];

// Thử một endpoint; trả về kết quả hoặc lỗi rút gọn
async function tryEndpoint(path) {
  const started = performance.now();
  try {
    const res = await api.get(path);
    return {
      ok: true,
      path,
      status: res.status,
      ms: Math.round(performance.now() - started),
      sample: typeof res.data === 'object' ? JSON.stringify(res.data).slice(0,200) : res.data,
    };
  } catch (err) {
    return {
      ok: false,
      path,
      status: err.response?.status,
      ms: Math.round(performance.now() - started),
      error: err.message,
    };
  }
}

// Kiểm tra kết nối backend: thử lần lượt các endpoint cho tới khi thành công đầu tiên.
export async function checkConnection() {
  for (const ep of PROBE_ENDPOINTS) {
    const result = await tryEndpoint(ep);
    if (result.ok) {
      return { connected: true, via: ep, detail: result };
    }
  }
  return { connected: false, tried: PROBE_ENDPOINTS };
}

// Hàm nhanh để log ra console (có thể gọi ở main.jsx)
export async function logConnectionStatus() {
  const status = await checkConnection();
  if (status.connected) {
    console.info('[Backend] CONNECTED qua', status.via, status.detail);
  } else {
    console.warn('[Backend] KHÔNG KẾT NỐI. Đã thử:', status.tried.join(', '));
  }
  return status;
}

// ==========================================
// AUTH SERVICE
// ==========================================
export const AuthService = {
  login: (data) => api.post('/v1/auth/login', data),
  logout: () => api.post('/v1/auth/logout'),
  register: (data) => api.post('/v1/auth/register', data),
  googleLogin: (token) => api.post('/v1/auth/google', { token }),
  refreshToken: () => api.post('/v1/auth/refresh'),
};

// ==========================================
// USER SERVICE
// ==========================================
export const UserService = {
  list: (params) => api.get('/v1/users', { params }),
  get: (id) => api.get(`/v1/users/${id}`),
  create: (data) => api.post('/v1/users', data),
  update: (id, data) => api.put(`/v1/users/${id}`, data),
  remove: (id) => api.delete(`/v1/users/${id}`),
  lock: (id) => api.put(`/v1/users/${id}/lock`),
  unlock: (id) => api.put(`/v1/users/${id}/unlock`),
  getCurrentUser: () => api.get('/v1/users/me'),
  updateProfile: (data) => api.put('/v1/users/me', data),
};

// ==========================================
// ROLE SERVICE
// ==========================================
export const RoleService = {
  list: () => api.get('/v1/roles'),
  get: (id) => api.get(`/v1/roles/${id}`),
  create: (data) => api.post('/v1/roles', data),
  update: (id, data) => api.put(`/v1/roles/${id}`, data),
  remove: (id) => api.delete(`/v1/roles/${id}`),
};

// ==========================================
// DOCTOR PROFILE SERVICE
// ==========================================
export const DoctorProfileService = {
  get: (doctorId) => api.get(`/v1/doctors/${doctorId}/profile`),
  create: (doctorId, data) => api.post(`/v1/doctors/${doctorId}/profile`, data),
  update: (doctorId, data) => api.put(`/v1/doctors/${doctorId}/profile`, data),
  uploadCertificate: (doctorId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/v1/doctors/${doctorId}/certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// ==========================================
// DOCTOR VERIFICATION SERVICE
// ==========================================
export const DoctorVerificationService = {
  list: (params) => api.get('/v1/doctor-verifications', { params }),
  get: (id) => api.get(`/v1/doctor-verifications/${id}`),
  submit: (doctorId, data) => api.post(`/v1/doctors/${doctorId}/verification`, data),
  approve: (id, remarks) => api.put(`/v1/doctor-verifications/${id}/approve`, { remarks }),
  reject: (id, remarks) => api.put(`/v1/doctor-verifications/${id}/reject`, { remarks }),
  getByDoctor: (doctorId) => api.get(`/v1/doctors/${doctorId}/verifications`),
};

// ==========================================
// FAMILY SERVICE
// ==========================================
export const FamilyService = {
  list: () => api.get('/v1/families'),
  get: (id) => api.get(`/v1/families/${id}`),
  create: (data) => api.post('/v1/families', data),
  update: (id, data) => api.put(`/v1/families/${id}`, data),
  remove: (id) => api.delete(`/v1/families/${id}`),
  getMyFamilies: () => api.get('/v1/families/my'),
};

// ==========================================
// FAMILY ACCESS SERVICE
// ==========================================
export const FamilyAccessService = {
  listByFamily: (familyId) => api.get(`/v1/families/${familyId}/access`),
  grant: (familyId, userId) => api.post(`/v1/families/${familyId}/access`, { userId }),
  revoke: (familyId, userId) => api.delete(`/v1/families/${familyId}/access/${userId}`),
};

// ==========================================
// FAMILY INVITE CODE SERVICE
// ==========================================
export const FamilyInviteService = {
  generate: (familyId) => api.post(`/v1/families/${familyId}/invite-code`),
  get: (familyId) => api.get(`/v1/families/${familyId}/invite-code`),
  join: (code) => api.post('/v1/families/join', { code }),
  deactivate: (familyId) => api.delete(`/v1/families/${familyId}/invite-code`),
};

// ==========================================
// FAMILY MEMBER SERVICE
// ==========================================
export const FamilyMemberService = {
  listByFamily: (familyId) => api.get(`/v1/families/${familyId}/members`),
  get: (id) => api.get(`/v1/family-members/${id}`),
  create: (familyId, data) => api.post(`/v1/families/${familyId}/members`, data),
  update: (id, data) => api.put(`/v1/family-members/${id}`, data),
  remove: (id) => api.delete(`/v1/family-members/${id}`),
  uploadProfileImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/v1/family-members/${id}/profile-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// ==========================================
// RELATIONSHIP TO CREATOR SERVICE
// ==========================================
export const RelationshipService = {
  list: () => api.get('/v1/relationships'),
  get: (id) => api.get(`/v1/relationships/${id}`),
  create: (data) => api.post('/v1/relationships', data),
  update: (id, data) => api.put(`/v1/relationships/${id}`, data),
  remove: (id) => api.delete(`/v1/relationships/${id}`),
};

// ==========================================
// MEMBER ACCESS SERVICE (Doctor access to member)
// ==========================================
export const MemberAccessService = {
  listByMember: (memberId) => api.get(`/v1/family-members/${memberId}/doctor-access`),
  listByDoctor: (doctorId) => api.get(`/v1/doctors/${doctorId}/member-access`),
  grant: (memberId, doctorId) => api.post(`/v1/family-members/${memberId}/doctor-access`, { doctorId }),
  revoke: (memberId, doctorId) => api.delete(`/v1/family-members/${memberId}/doctor-access/${doctorId}`),
};

// ==========================================
// APPOINTMENT SERVICE
// ==========================================
export const AppointmentService = {
  list: (params) => api.get('/v1/appointments', { params }),
  get: (id) => api.get(`/v1/appointments/${id}`),
  create: (data) => api.post('/v1/appointments', data),
  update: (id, data) => api.put(`/v1/appointments/${id}`, data),
  remove: (id) => api.delete(`/v1/appointments/${id}`),
  cancel: (id, reason) => api.put(`/v1/appointments/${id}/cancel`, { reason }),
  complete: (id, medicalNotes) => api.put(`/v1/appointments/${id}/complete`, { medicalNotes }),
  getByPatient: (patientId) => api.get(`/v1/family-members/${patientId}/appointments`),
  getByDoctor: (doctorId) => api.get(`/v1/doctors/${doctorId}/appointments`),
  getMyAppointments: () => api.get('/v1/appointments/my'),
};

// ==========================================
// VACCINE SERVICE
// ==========================================
export const VaccineService = {
  list: () => api.get('/v1/vaccines'),
  get: (id) => api.get(`/v1/vaccines/${id}`),
  create: (data) => api.post('/v1/vaccines', data),
  update: (id, data) => api.put(`/v1/vaccines/${id}`, data),
  remove: (id) => api.delete(`/v1/vaccines/${id}`),
};

// ==========================================
// VACCINATION RECORD SERVICE
// ==========================================
export const VaccinationRecordService = {
  get: (id) => api.get(`/v1/vaccination-records/${id}`),
  update: (id, data) => api.put(`/v1/vaccination-records/${id}`, data),
  remove: (id) => api.delete(`/v1/vaccination-records/${id}`),
  listByMember: (memberId) => api.get(`/v1/family-members/${memberId}/vaccination-records`),
  createForMember: (memberId, data) => api.post(`/v1/family-members/${memberId}/vaccination-records`, data),
};

// ==========================================
// FACILITY SERVICE
// ==========================================
export const FacilityService = {
  list: () => api.get('/v1/facilities'),
  get: (id) => api.get(`/v1/facilities/${id}`),
  create: (data) => api.post('/v1/facilities', data),
  update: (id, data) => api.put(`/v1/facilities/${id}`, data),
  remove: (id) => api.delete(`/v1/facilities/${id}`),
};

// ==========================================
// MEDICAL RECORD SERVICE
// ==========================================
export const MedicalRecordService = {
  list: (params) => api.get('/v1/medical-records', { params }),
  get: (id) => api.get(`/v1/medical-records/${id}`),
  create: (data) => api.post('/v1/medical-records', data),
  update: (id, data) => api.put(`/v1/medical-records/${id}`, data),
  remove: (id) => api.delete(`/v1/medical-records/${id}`),
  listByMember: (memberId) => api.get(`/v1/family-members/${memberId}/medical-records`),
  listByDoctor: (doctorId) => api.get(`/v1/doctors/${doctorId}/medical-records`),
};

// ==========================================
// MEDICAL DOCUMENT SERVICE
// ==========================================
export const MedicalDocumentService = {
  listByRecord: (recordId) => api.get(`/v1/medical-records/${recordId}/documents`),
  get: (id) => api.get(`/v1/medical-documents/${id}`),
  upload: (recordId, file, fileType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    return api.post(`/v1/medical-records/${recordId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  remove: (id) => api.delete(`/v1/medical-documents/${id}`),
  download: (id) => api.get(`/v1/medical-documents/${id}/download`, { responseType: 'blob' }),
};

// ==========================================
// DRUG SERVICE
// ==========================================
export const DrugService = {
  list: (params) => api.get('/v1/drugs', { params }),
  get: (id) => api.get(`/v1/drugs/${id}`),
  create: (data) => api.post('/v1/drugs', data),
  update: (id, data) => api.put(`/v1/drugs/${id}`, data),
  remove: (id) => api.delete(`/v1/drugs/${id}`),
  search: (query) => api.get('/v1/drugs/search', { params: { q: query } }),
};

// ==========================================
// PRESCRIPTION SERVICE
// ==========================================
export const PrescriptionService = {
  listByRecord: (recordId) => api.get(`/v1/medical-records/${recordId}/prescriptions`),
  get: (id) => api.get(`/v1/prescriptions/${id}`),
  create: (recordId, data) => api.post(`/v1/medical-records/${recordId}/prescriptions`, data),
  update: (id, data) => api.put(`/v1/prescriptions/${id}`, data),
  remove: (id) => api.delete(`/v1/prescriptions/${id}`),
};

// ==========================================
// PRESCRIPTION ITEM SERVICE
// ==========================================
export const PrescriptionItemService = {
  listByPrescription: (prescriptionId) => api.get(`/v1/prescriptions/${prescriptionId}/items`),
  get: (id) => api.get(`/v1/prescription-items/${id}`),
  create: (prescriptionId, data) => api.post(`/v1/prescriptions/${prescriptionId}/items`, data),
  update: (id, data) => api.put(`/v1/prescription-items/${id}`, data),
  remove: (id) => api.delete(`/v1/prescription-items/${id}`),
};

// ==========================================
// ALLERGY SERVICE
// ==========================================
export const AllergyService = {
  listByMember: (memberId) => api.get(`/v1/family-members/${memberId}/allergies`),
  get: (id) => api.get(`/v1/allergies/${id}`),
  create: (memberId, data) => api.post(`/v1/family-members/${memberId}/allergies`, data),
  update: (id, data) => api.put(`/v1/allergies/${id}`, data),
  remove: (id) => api.delete(`/v1/allergies/${id}`),
};

// ==========================================
// HEALTH STATS TYPE SERVICE
// ==========================================
export const HealthStatsTypeService = {
  list: () => api.get('/v1/health-stats-types'),
  get: (id) => api.get(`/v1/health-stats-types/${id}`),
  create: (data) => api.post('/v1/health-stats-types', data),
  update: (id, data) => api.put(`/v1/health-stats-types/${id}`, data),
  remove: (id) => api.delete(`/v1/health-stats-types/${id}`),
};

// ==========================================
// HEALTH STATS SERVICE
// ==========================================
export const HealthStatsService = {
  listByMember: (memberId, params) => api.get(`/v1/family-members/${memberId}/health-stats`, { params }),
  get: (id) => api.get(`/v1/health-stats/${id}`),
  create: (memberId, data) => api.post(`/v1/family-members/${memberId}/health-stats`, data),
  update: (id, data) => api.put(`/v1/health-stats/${id}`, data),
  remove: (id) => api.delete(`/v1/health-stats/${id}`),
  getByType: (memberId, typeId, params) => api.get(`/v1/family-members/${memberId}/health-stats/type/${typeId}`, { params }),
  getLatest: (memberId, typeId) => api.get(`/v1/family-members/${memberId}/health-stats/type/${typeId}/latest`),
};

// ==========================================
// EXPORT ALL SERVICES
// ==========================================
export default {
  Auth: AuthService,
  User: UserService,
  Role: RoleService,
  DoctorProfile: DoctorProfileService,
  DoctorVerification: DoctorVerificationService,
  Family: FamilyService,
  FamilyAccess: FamilyAccessService,
  FamilyInvite: FamilyInviteService,
  FamilyMember: FamilyMemberService,
  Relationship: RelationshipService,
  MemberAccess: MemberAccessService,
  Appointment: AppointmentService,
  Vaccine: VaccineService,
  VaccinationRecord: VaccinationRecordService,
  Facility: FacilityService,
  MedicalRecord: MedicalRecordService,
  MedicalDocument: MedicalDocumentService,
  Drug: DrugService,
  Prescription: PrescriptionService,
  PrescriptionItem: PrescriptionItemService,
  Allergy: AllergyService,
  HealthStatsType: HealthStatsTypeService,
  HealthStats: HealthStatsService,
};