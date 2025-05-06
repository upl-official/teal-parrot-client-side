import { testApiConnection } from "@/lib/api-test"

/**
 * Silently tests the API connection without displaying any UI alerts
 * This function runs in the background and logs any issues to the console
 */
export async function runSilentApiConnectionTest() {
  try {
    const isConnected = await testApiConnection()

    if (!isConnected) {
      console.warn("API connection issue detected. Some features may not work correctly.")
    }

    return isConnected
  } catch (error) {
    console.error("Error testing API connection:", error)
    return false
  }
}
