import { delay } from "../utils";

// Mock users database
const users = [
  {
    id: "1",
    email: "patient@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    role: "patient",
    createdAt: "2024-01-15T10:30:00Z",
    profileImage:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "2",
    email: "doctor@example.com",
    password: "password123",
    firstName: "Sarah",
    lastName: "Smith",
    role: "doctor",
    specialization: "Dermatology",
    createdAt: "2023-11-05T14:20:00Z",
    profileImage:
      "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "password123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: "2023-10-01T09:00:00Z",
    profileImage:
      "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

// Login user
export const loginUser = async (email, password) => {
  await delay(800); // Simulate API delay

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Store in localStorage to persist session
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem("skin-scan-user", JSON.stringify(userWithoutPassword));
  localStorage.setItem("skin-scan-token", "mock-jwt-token-" + user.id);

  return { user: userWithoutPassword };
};

// Register user
export const registerUser = async (userData) => {
  await delay(1000); // Simulate API delay

  const existingUser = users.find((u) => u.email === userData.email);
  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Create new user (in a real app this would be saved to a database)
  const newUser = {
    id: String(users.length + 1),
    ...userData,
    role: "patient", // Default role for new registrations
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Store in localStorage to persist session
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem("skin-scan-user", JSON.stringify(userWithoutPassword));
  localStorage.setItem("skin-scan-token", "mock-jwt-token-" + newUser.id);

  return { user: userWithoutPassword };
};

// Logout user
export const logoutUser = async () => {
  await delay(300); // Simulate API delay

  localStorage.removeItem("skin-scan-user");
  localStorage.removeItem("skin-scan-token");

  return { success: true };
};

// Get current user
export const getCurrentUser = async () => {
  const userJson = localStorage.getItem("skin-scan-user");
  const token = localStorage.getItem("skin-scan-token");

  if (!userJson || !token) {
    return null;
  }

  try {
    return JSON.parse(userJson);
  } catch (error) {
    localStorage.removeItem("skin-scan-user");
    localStorage.removeItem("skin-scan-token");
    return null;
  }
};
