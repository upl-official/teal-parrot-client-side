// API Error Handler
export enum ApiErrorType {
  NETWORK = "network",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  NOT_FOUND = "not_found",
  VALIDATION = "validation",
  SERVER = "server",
  UNKNOWN = "unknown",
}

export interface ApiError {
  type: ApiErrorType
  message: string
  originalError?: any
  statusCode?: number
}

export function handleApiError(error: any, context: string): ApiError {
  console.error(`API Error in ${context}:`, error)

  // Network errors
  if (
    error.message &&
    (error.message.includes("Failed to fetch") || error.message.includes("Network request failed"))
  ) {
    return {
      type: ApiErrorType.NETWORK,
      message: "Unable to connect to the server. Please check your internet connection.",
      originalError: error,
    }
  }

  // Authentication errors
  if (error.statusCode === 401 || (error.message && error.message.includes("Unauthorized"))) {
    return {
      type: ApiErrorType.AUTHENTICATION,
      message: "Your session has expired. Please log in again.",
      originalError: error,
      statusCode: 401,
    }
  }

  // Authorization errors
  if (error.statusCode === 403 || (error.message && error.message.includes("Forbidden"))) {
    return {
      type: ApiErrorType.AUTHORIZATION,
      message: "You do not have permission to perform this action.",
      originalError: error,
      statusCode: 403,
    }
  }

  // Not found errors
  if (error.statusCode === 404 || (error.message && error.message.includes("Not found"))) {
    return {
      type: ApiErrorType.NOT_FOUND,
      message: "The requested resource was not found.",
      originalError: error,
      statusCode: 404,
    }
  }

  // Validation errors
  if (error.statusCode === 400 || (error.message && error.message.includes("validation"))) {
    return {
      type: ApiErrorType.VALIDATION,
      message: "There was a problem with the data you submitted.",
      originalError: error,
      statusCode: 400,
    }
  }

  // Server errors
  if (error.statusCode && error.statusCode >= 500) {
    return {
      type: ApiErrorType.SERVER,
      message: "There was a problem with the server. Please try again later.",
      originalError: error,
      statusCode: error.statusCode,
    }
  }

  // Unknown errors
  return {
    type: ApiErrorType.UNKNOWN,
    message: "An unexpected error occurred. Please try again.",
    originalError: error,
  }
}

// Function to get user-friendly error message
export function getUserFriendlyErrorMessage(error: any, context: string): string {
  const apiError = handleApiError(error, context)
  return apiError.message
}
