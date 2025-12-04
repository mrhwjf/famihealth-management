import axios from "axios";
const API_BASE_URL = "http://localhost:8080/api/v1/";

export async function getDashboardData(session_id) {
    try {
        const response = await axios.get(`${API_BASE_URL}dashboard/${session_id}`);
        const data = await response.data;
        return data;
    } catch (err) {
        console.error("Loi khi fetch dashboard:", err);
        return null;
    }
}