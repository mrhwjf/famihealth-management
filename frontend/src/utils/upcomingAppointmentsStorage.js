const STORAGE_PREFIX = "fh-upcoming-appts";

const normalizeUserKey = (userId) => {
    if (userId === null || userId === undefined || userId === "") {
        return "guest";
    }
    return String(userId);
};

const buildStorageKey = (userId) => `${STORAGE_PREFIX}-${normalizeUserKey(userId)}`;

const resolveCandidateKeys = (userId, includeGuestFallback) => {
    const primary = buildStorageKey(userId);
    if (!includeGuestFallback) return [primary];
    if (normalizeUserKey(userId) === "guest") return [primary];
    return [primary, buildStorageKey(null)];
};

const parseArray = (raw) => {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn("Không thể parse lịch hẹn từ localStorage:", error);
        return [];
    }
};

export const loadStoredAppointments = (userId, { includeGuestFallback = true } = {}) => {
    if (typeof window === "undefined") return [];
    for (const key of resolveCandidateKeys(userId, includeGuestFallback)) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) continue;
            const parsed = parseArray(raw);
            return parsed;
        } catch (error) {
            console.warn(`Không đọc được lịch hẹn từ localStorage (${key}):`, error);
        }
    }
    return [];
};

export const saveStoredAppointments = (userId, items) => {
    if (typeof window === "undefined") return;
    try {
        const key = buildStorageKey(userId);
        localStorage.setItem(key, JSON.stringify(Array.isArray(items) ? items : []));
    } catch (error) {
        console.warn("Không ghi được lịch hẹn vào localStorage:", error);
    }
};

export const appointmentIdentity = (item = {}) => {
    if (!item || typeof item !== "object") return null;
    const source = item.meta ?? item;
    if (!source || typeof source !== "object") return null;
    const timeValue =
        source.appointmentDatetime ||
        source.appointmentDate ||
        source.date ||
        source.start ||
        source.createdAt ||
        "";
    return (
        source.id ??
        source.localId ??
        `${source.patientId ?? "p"}-${source.doctorId ?? "d"}-${timeValue}`
    );
};

export const mergeAppointmentLists = (...lists) => {
    const map = new Map();
    lists
        .flat()
        .filter(Boolean)
        .forEach((item) => {
            const key = appointmentIdentity(item);
            if (!key) return;
            if (!map.has(key)) {
                map.set(key, item);
            }
        });
    return Array.from(map.values());
};

export const upsertStoredAppointment = (userId, appointment, limit = 50) => {
    if (!appointment) return;
    const existing = loadStoredAppointments(userId);
    const filtered = existing.filter(
        (item) => appointmentIdentity(item) !== appointmentIdentity(appointment)
    );
    filtered.unshift({
        ...appointment,
        localId: appointment.localId ?? Date.now(),
    });
    saveStoredAppointments(userId, filtered.slice(0, limit));
};

export { buildStorageKey };
