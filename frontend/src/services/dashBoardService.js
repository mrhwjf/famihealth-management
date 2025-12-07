import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

const buildHeaders = (sessionId) =>
    sessionId
        ? {
            "X-Session-Id": sessionId,
        }
        : {};

export async function getDashboardData(sessionId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard`, {
            headers: buildHeaders(sessionId),
        });
        return response?.data ?? null;
    } catch (err) {
        console.error("Lỗi khi fetch dashboard:", err?.response ?? err);
        throw err;
    }
}