import { getAuthToken } from "./auth"

/**
 * Tests the API connection to ensure it's working correctly
 * @returns A promise that resolves to a boolean indicating if the connection is successful
 */
export async function testApiConnection(): Promise<boolean> {
  try {
    const API_BASE_URL = "https://backend-project-r734.onrender.com/api/v1"

    // Try to fetch categories as a simple test
    const response = await fetch(`${API_BASE_URL}/category/cat-list/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("API connection test failed:", await response.text())
      return false
    }

    const data = await response.json()
    console.log("API connection test successful:", data)
    return true
  } catch (error) {
    console.error("API connection test error:", error)
    return false
  }
}

/**
 * Tests the authentication by trying to fetch user-specific data
 * @param userId The user ID to test with
 * @returns A promise that resolves to a boolean indicating if authentication is working
 */
export async function testAuthentication(userId: string): Promise<boolean> {
  try {
    const API_BASE_URL = "https://backend-project-r734.onrender.com/api/v1"
    const token = getAuthToken()

    if (!token) {
      console.error("No authentication token available")
      return false
    }

    // Try to fetch user data as an authentication test
    const response = await fetch(`${API_BASE_URL}/users/user/single?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error("Authentication test failed:", await response.text())
      return false
    }

    const data = await response.json()
    console.log("Authentication test successful:", data)
    return true
  } catch (error) {
    console.error("Authentication test error:", error)
    return false
  }
}
