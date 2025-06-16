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
    console.log("Making registration request with data:", { name, email, phone })

    const response = await fetch(`${API_BASE_URL}/users/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone }),
    })

    console.log("Registration response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Registration failed with error:", errorData)
      throw new Error(errorData.message || "Registration failed")
    }

    const data = await response.json()
    console.log("Registration response data:", data)

    if (!data.success) {
      throw new Error(data.message || "Registration failed")
    }

    // Handle different possible response structures
    let user: User
    let token: string

    // Check various possible response structures
    if (data.data) {
      // Structure: { success: true, data: { user: {...}, token: "..." } }
      user = data.data.user || data.data
      token = data.data.token || data.data.accessToken || ""
    } else {
      // Structure: { success: true, user: {...}, token: "..." }
      user = data.user
      token = data.token || data.accessToken || ""
    }

    console.log("Extracted user and token:", {
      user: user ? { id: user._id, name: user.name, email: user.email } : null,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
    })

    // Validate that we have the required data
    if (!user || !user._id || !user.email) {
      console.error("Invalid user data received:", user)
      throw new Error("Registration successful but user data is incomplete. Please try logging in.")
    }

    // Token might not be provided in registration response for some APIs
    // In that case, we'll proceed without token and user can login manually
    if (!token) {
      console.warn("No token received during registration. User will need to login manually.")
      throw new Error("Registration successful! Please log in with your credentials.")
    }

    return {
      user,
      token,
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
  refreshAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        console.log("Auth store login called with:", { user: user?.name, token: token ? "present" : "missing" })
        set({ user, token, isAuthenticated: !!token && !!user })
      },
      logout: () => {
        console.log("Auth store logout called")
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      getToken: () => {
        const token = get().token
        console.log("Getting token from auth store:", token ? "present" : "missing")
        return token
      },
      refreshAuth: async () => {
        const state = get()
        if (state.user && state.token) {
          try {
            // Verify the token is still valid by fetching user profile
            const updatedUser = await getUserProfile(state.user._id, state.token)
            set({ user: updatedUser })
          } catch (error) {
            console.error("Token validation failed, logging out:", error)
            set({ user: null, token: null, isAuthenticated: false })
          }
        }
      },
    }),
    {
      name: "teal-parrot-auth",
      // Add custom storage to ensure proper hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Auth store rehydrated:", {
            user: state.user?.name,
            token: state.token ? "present" : "missing",
            isAuthenticated: state.isAuthenticated,
          })
        }
      },
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
  const token = useAuthStore.getState().token
  console.log("getAuthToken called, token:", token ? "present" : "missing")
  return token
}

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const state = useAuthStore.getState()
  const authenticated = state.isAuthenticated && !!state.token && !!state.user
  console.log("isAuthenticated check:", {
    isAuthenticated: state.isAuthenticated,
    hasToken: !!state.token,
    hasUser: !!state.user,
    result: authenticated,
  })
  return authenticated
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
