import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

const buildHeaders = (sessionId) =>
    sessionId
        ? {
            "X-Session-Id": sessionId,
            "Content-Type": "application/json",
        }
        : { "Content-Type": "application/json" };

export const appointmentService = {
    getAppointmentFormData: async (sessionId) => {
        const res = await axios.get(`${API_BASE}/appointments/form-data`, {
            headers: buildHeaders(sessionId),
        });
        return res.data;
    },

    getAppointments: async (sessionId, params = {}) => {
        const res = await axios.get(`${API_BASE}/appointments?`, {
            headers: buildHeaders(sessionId),
            params,
        });
        return res.data;
    },

    createAppointment: async (sessionId, appointmentData) => {
        try {
            // return full axios response so caller can inspect status and data
            const res = await axios.post(`${API_BASE}/appointments`, appointmentData, {
                headers: buildHeaders(sessionId),
            });
            return res; // NOT res.data
        } catch (err) {
            // Log useful server info here too
            console.error(
                "createAppointment failed:",
                err?.response?.status,
                err?.response?.data ?? err.message
            );
            throw err;
        }
    },
};