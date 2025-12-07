import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

const buildHeaders = (sessionId) =>
  sessionId
    ? {
      "X-Session-Id": sessionId,
    }
    : {};

const unwrap = (res) => res?.data?.data ?? res?.data ?? [];

export const allergiesService = {
  /**
   * Lấy danh sách dị ứng của một thành viên gia đình
   */
  getMemberAllergies: async (sessionId, familyMemberId) => {
    if (!familyMemberId) return [];
    const res = await axios.get(
      `${API_BASE}/family-members/${familyMemberId}/allergies`,
      {
        headers: buildHeaders(sessionId),
      }
    );
    return unwrap(res);
  },
  /**
   * Lấy danh sách dị ứng của cả gia đình dựa trên familyId
   */
  getFamilyAllergies: async (sessionId, familyId) => {
    if (!familyId) return [];
    const res = await axios.get(
      `${API_BASE}/families/${familyId}/allergies`,
      {
        headers: buildHeaders(sessionId),
      }
    );
    return unwrap(res);
  },
};