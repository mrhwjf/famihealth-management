import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/families";


export async function getMyFamilyMember(family_id, session_id, member_id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${family_id}/members/${member_id}`,
      {
        headers: session_id ? { "X-Session-Id": session_id } : {},
      }
    );
    return response?.data?.data ?? null;
  } catch (err) {
    // log the server response if available — this helps debug 500s
    console.error(
      "getMyFamilyMember error:",
      err?.response?.status,
      err?.response?.data ?? err.message
    );

    // fallback: try to fetch the list and match by id
    try {
      const list = await getMyFamily(session_id);
      if (Array.isArray(list) && list.length > 0) {
        const found = list.find((m) => String(m.id) === String(member_id)) ?? null;
        if (found) {
          console.warn(
            "getMyFamilyMember: using fallback member from list because detail endpoint failed."
          );
          return found;
        }
      }
    } catch (e) {
      console.error("Fallback list fetch also failed:", e);
    }

    return null;
  }
}
export async function getMyFamily(session_id) {
    const resp = await axios.get(`${API_BASE_URL}/me/members`, {
        headers: { "X-Session-Id": session_id },
    });
    // return the array directly (or [] if backend returns odd shape)
    return resp?.data?.data ?? [];
}
