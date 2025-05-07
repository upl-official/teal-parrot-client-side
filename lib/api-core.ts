// Base URL for API
export const API_BASE_URL = "https://backend-project-r734.onrender.com/api/v1"

// Helper function for API requests with error handling
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Get the authentication token if available
    let token = null
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    // Prepare headers with authentication if token exists
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    }

    // Log the request for debugging
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.parse(options.body as string) : undefined,
    })

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed: ${response.statusText}`)
    }

    const responseData = await response.json()

    // Log the response for debugging
    console.log(`API response from: ${API_BASE_URL}${endpoint}`, responseData)

    // Check if the API returned success: false
    if (responseData.success === false) {
      throw new Error(responseData.message || "API request failed")
    }

    return responseData
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}
