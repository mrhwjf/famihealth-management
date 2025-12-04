// services/contactDoctor.js
import axios from "axios";



export const searchDoctors = async ({
    field = "",
    keyword = "",
    roleId = 2,
    page = 0,
    size = 6,
}) => {
    try {
        const API_BASE_URL = `http://localhost:8080/api/v1/users?field=${field}&locked=false&roleId=${roleId}&keyword=${keyword}&page=${page}&size=${size}`;
        const res = await axios.get(API_BASE_URL);
        return res.data;
    } catch (err) {
        console.error("searchDoctors API error:", err);
        throw err;
    }
};
