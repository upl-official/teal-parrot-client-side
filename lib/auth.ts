import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "./types"

// Update the API_BASE_URL constant at the top of the file
const API_BASE_URL = "https://backend-project-r734.onrender.com/api/v1"

// Update the loginUser function to match the API documentation
export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Login failed")
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Login failed")
    }

    // Return both user and token
    return {
      user: data.data.user,
      token: data.data.token,
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Update the registerUser function to match the API documentation
export async function registerUser(
  name: string,
  email: string,
  password: string,
  phone: string,
): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Registration failed")
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Registration failed")
    }

    // Return both user and token
    return {
      user: data.data.user,
      token: data.data.token || "", // Add fallback in case token is not provided
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export async function getUserProfile(userId: string, token: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch user profile")
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch user profile")
    }

    return data.data.user
  } catch (error) {
    console.error("Get profile error:", error)
    throw error
  }
}

// Replace the existing updateUserProfile function with this updated version
export async function updateUserProfile(userId: string, userData: Partial<User>, token: string): Promise<User> {
  try {
    // Only allow name and phone to be updated
    const allowedData = {
      ...(userData.name && { name: userData.name }),
      ...(userData.phone && { phone: userData.phone }),
    }

    const response = await fetch(`${API_BASE_URL}/users/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        ...allowedData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update user profile")
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to update user profile")
    }

    return data.data.user
  } catch (error) {
    console.error("Update profile error:", error)
    throw error
  }
}

// Auth store using Zustand with persistence
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  getToken: () => string | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      getToken: () => get().token,
    }),
    {
      name: "teal-parrot-auth",
    },
  ),
)

// Helper function to get the current user ID from the auth store
export const getCurrentUserId = (): string => {
  const user = useAuthStore.getState().user
  return user?._id || ""
}

// Helper function to get the authentication token
export const getAuthToken = (): string | null => {
  return useAuthStore.getState().token
}

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated
}

/**
 * Redirects to login page with the current URL as redirect parameter
 * @param currentPath The current path to redirect back to after login
 */
export const redirectToLogin = (currentPath: string): void => {
  if (typeof window !== "undefined") {
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
  }
}
