import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/users";


export async function getMyProfiles(user_id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/${user_id}`);
        const data = await response.data;
        return data;
    } catch (err) {
        console.error("Lỗi khi fetch my profiles:", err);
        return null;
    }
}
