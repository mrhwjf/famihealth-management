import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

export const allergiesService = {
  // Fetch allergies for a specific family member
  getAllergies: async (sessionId, familyMemberId) => {
    const headers = sessionId ? { "x-session-id": sessionId } : {};
    const res = await axios.get(`${API_BASE}/allergies/${familyMemberId}`, {
      headers,
    });
    return res.data;
  },
};