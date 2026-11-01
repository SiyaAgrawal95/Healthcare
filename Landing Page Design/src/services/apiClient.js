const TOKEN_KEY = "healthcare_auth_token";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export async function apiRequest(path, options = {}) {
  const { auth = true, headers = {}, ...requestOptions } = options;
  const token = auth ? getAuthToken() : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(requestOptions.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && auth) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("healthcare_current_user");
    }
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload;
}

export { TOKEN_KEY };
