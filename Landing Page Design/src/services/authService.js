const STORAGE_KEY = "healthcare_users";
const CURRENT_USER_KEY = "healthcare_current_user";

// DEMO PATIENT - For demonstration purposes only
const DEMO_USER = {
  patientId: "PAT-1000",
  fullName: "Demo Patient",
  email: "demo@urinex.demo",
  password: "demo",
  dateOfBirth: "1990-01-01",
  gender: "prefer-not-to-say",
  phoneNumber: "0000000000",
  isDemo: true,
};

const getNextPatientId = () => {
  const users = getUsers();
  const maxId = users.reduce((max, user) => {
    const idNum = parseInt(user.patientId.replace("PAT-", ""), 10);
    return idNum > max ? idNum : max;
  }, 1000);
  return `PAT-${maxId + 1}`;
};

export const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error reading users from localStorage:", error);
    return [];
  }
};

export const saveUser = (userData) => {
  try {
    const users = getUsers();
    const patientId = getNextPatientId();
    const newUser = {
      ...userData,
      patientId,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return newUser;
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
    throw new Error("Failed to save user data");
  }
};

export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find((user) => user.email === email);
};

export const validateLogin = (email, password) => {
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.password !== password) {
    return { success: false, message: "Invalid password" };
  }
  return { success: true, user };
};

export const loginDemoUser = () => {
  try {
    setCurrentUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  } catch (error) {
    console.error("Error logging in demo user:", error);
    return { success: false, message: "Failed to login demo user" };
  }
};

export const setCurrentUser = (user) => {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error setting current user:", error);
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logout = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
