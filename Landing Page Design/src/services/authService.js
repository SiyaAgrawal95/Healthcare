import { apiRequest, getAuthToken, TOKEN_KEY } from "./apiClient";

const CURRENT_USER_KEY = "healthcare_current_user";

export async function saveUser(userData) {
  const { patient } = await apiRequest("/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(userData),
  });
  return patient;
}

export async function loginUser(email, password) {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
  setCurrentUser(result.patient, result.token);
  return { success: true, user: result.patient };
}

export async function getPatientProfile() {
  const { patient } = await apiRequest("/patients/me");
  return patient;
}

export async function updatePatientProfile(profile) {
  const { patient } = await apiRequest("/patients/me", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });
  setCurrentUser(patient);
  return patient;
}

export async function loginDemoUser() {
  return {
    success: false,
    message: "Demo login is not connected to the database. Please create an account to continue.",
  };
}

export const setCurrentUser = (user, token = getAuthToken()) => {
  if (!user || !token) return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export const getCurrentUser = () => {
  if (!getAuthToken()) return null;
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => Boolean(getCurrentUser() && getAuthToken());
