import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

const buildHeaders = (sessionId) =>
    sessionId
        ? {
            "X-Session-Id": sessionId,
        }
        : {};

const unwrap = (res) => res?.data?.data ?? res?.data ?? [];

export const vaccineService = {
    /**
   * Lấy danh sách tiêm chủng của một thành viên gia đình
   */
    getMemberVaccines: async (sessionId, familyMemberId) => {
        if (!familyMemberId) return [];
        const res = await axios.get(
            `${API_BASE}/vaccination-records/${familyMemberId}`,
            {
                headers: buildHeaders(sessionId),
            }
        );
        return unwrap(res);
    }
}