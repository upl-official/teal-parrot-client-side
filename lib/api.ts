import type { Product, CartItem, WishlistItem, Category, Material, Grade, Address, Order, User } from "./types"
import { getAuthToken, useAuthStore } from "@/lib/auth"
import { dispatchCartUpdateEvent } from "./cart-events"

// Base URL for API
const API_BASE_URL = "https://backend-project-r734.onrender.com/api/v1"

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

// Helper function to ensure image URLs are complete
function ensureFullImageUrl(imageUrl: string): string {
  if (!imageUrl) return PLACEHOLDER_IMAGE

  if (imageUrl.startsWith("http")) {
    return imageUrl
  }

  // Check if we're running locally or on production
  const baseUrl =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://backend-project-r734.onrender.com"

  return `${baseUrl}/${imageUrl}`
}

// Helper function for API requests with error handling
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Get the authentication token
    const token = getAuthToken()

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

// Process product data to ensure image URLs are complete
function processProductData(product: any): Product {
  return {
    ...product,
    images: product.images?.map(ensureFullImageUrl) || [PLACEHOLDER_IMAGE],
  }
}

// Product APIs
export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  const endpoint = categoryId ? `/product/list/?categoryId=${categoryId}` : "/product/list"

  const data = await apiRequest<{ success: boolean; data: { products: any[] } }>(endpoint)
  return data.data.products.map(processProductData)
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  // For featured products, we'll use the discounted products endpoint
  const data = await apiRequest<{ success: boolean; data: any[] }>("/pro/product-discount")
  return data.data.map(processProductData)
}

export async function fetchProductById(productId: string): Promise<Product> {
  const data = await apiRequest<{ success: boolean; data: { product: any } }>(`/product/list/?productId=${productId}`)

  if (!data.data.product) {
    throw new Error("Product not found")
  }

  return processProductData(data.data.product)
}

export async function fetchSimilarProducts(category?: string): Promise<Product[]> {
  const data = await apiRequest<{ success: boolean; data: { products: any[] } }>("/product/list")

  let products = data.data.products.map(processProductData)

  if (category) {
    products = products.filter((product) => product.category === category)
  }

  // Limit to 8 products for similar items
  return products.slice(0, 8)
}

// Category APIs
export async function fetchCategories(): Promise<Category[]> {
  const response = await apiRequest<{ success: boolean; data: Category[] }>("/category/cat-list")
  return response.data
}

// Material APIs
export async function fetchMaterials(): Promise<Material[]> {
  const response = await apiRequest<{ success: boolean; data: Material[] }>("/material/mat-list")
  return response.data
}

// Grade APIs
export async function fetchGrades(): Promise<Grade[]> {
  const response = await apiRequest<{ success: boolean; data: Grade[] }>("/grade/gra-list")
  return response.data
}

// Address APIs
export async function fetchUserAddresses(userId: string): Promise<Address[]> {
  try {
    const data = await apiRequest<{ success: boolean; data: Address[] | Address }>(
      `/users/address/list?userId=${userId}`,
    )

    // Log the response to debug
    console.log("Address API response:", data)

    // Handle both array and single object responses
    if (Array.isArray(data.data)) {
      return data.data
    } else if (data.data && typeof data.data === "object") {
      // If it's a single address object, return it as an array
      return [data.data]
    }

    return []
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return []
  }
}

export async function addUserAddress(userId: string, addressData: Partial<Address>): Promise<Address> {
  const data = await apiRequest<{ success: boolean; data: Address }>("/users/address/add", {
    method: "POST",
    body: JSON.stringify({
      userId,
      address: addressData.address,
      state: addressData.state,
      city: addressData.city,
      pincode: addressData.pincode,
    }),
  })
  return data.data
}

export async function updateUserAddress(addressId: string, addressData: Partial<Address>): Promise<Address> {
  const userId = getCurrentUserId()
  const data = await apiRequest<{ success: boolean; data: Address }>("/users/address/update", {
    method: "PUT",
    body: JSON.stringify({
      userId,
      addressId,
      address: addressData.address,
      state: addressData.state,
      city: addressData.city,
      pincode: addressData.pincode,
    }),
  })
  return data.data
}

export async function deleteUserAddress(addressId: string): Promise<void> {
  const userId = getCurrentUserId()
  await apiRequest("/users/address/remove", {
    method: "DELETE", // Changed to DELETE as per the API docs
    body: JSON.stringify({ userId, addressId }),
  })
}

// Order APIs
export async function fetchUserOrders(userId: string): Promise<any[]> {
  try {
    const data = await apiRequest<{ success: boolean; data: any[] }>(`/users/order/list?user=${userId}`)
    return data.data || []
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

// User APIs
export async function updateUserProfile(userId: string, userData: { name?: string; phone?: string }): Promise<User> {
  try {
    // Validate required fields
    if (!userId) {
      throw new Error("User ID is required for updating profile")
    }

    // Create the request body with only allowed fields
    const requestBody = {
      userId,
      ...(userData.name && { name: userData.name }),
      ...(userData.phone && { phone: userData.phone }),
    }

    const data = await apiRequest<{ success: boolean; data: { user: User } }>("/users/user/update", {
      method: "PUT",
      body: JSON.stringify(requestBody),
    })

    return data.data.user
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export async function fetchOrderDetails(orderId: string): Promise<Order> {
  const data = await apiRequest<{ success: boolean; data: { order: Order } }>(`/users/order/${orderId}`)
  return data.data.order
}

export async function createOrder(orderData: {
  userId: string
  productId: string
  quantity: number
  addressId: string
}): Promise<Order> {
  const data = await apiRequest<{ success: boolean; data: { order: Order } }>("/users/order/place-order", {
    method: "POST",
    body: JSON.stringify(orderData),
  })

  // Dispatch cart update event after successful order creation
  dispatchCartUpdateEvent()

  return data.data.order
}

// Cart APIs
export async function fetchCartItems(userId: string): Promise<CartItem[]> {
  try {
    const data = await apiRequest<{ success: boolean; data: { items: any[]; totalPrice: number } }>(
      `/users/cart/list?userId=${userId}`,
    )

    // Map the API response to our CartItem structure
    return (data.data.items || []).map((item) => ({
      product: {
        _id: item.productId,
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        material: item.material,
        grade: item.grade,
        images: [PLACEHOLDER_IMAGE], // Use custom placeholder image
      },
      quantity: item.quantity,
    }))
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return []
  }
}

// Update the cart functions to match the API documentation
export async function addToCart(userId: string, productId: string, quantity: number): Promise<void> {
  console.log("Adding to cart with data:", { userId, productId, quantity })

  await apiRequest("/users/cart/add", {
    method: "POST",
    body: JSON.stringify({ userId, productId, quantity }),
  })

  // Dispatch cart update event after successful addition
  dispatchCartUpdateEvent()
}

export async function removeFromCart(userId: string, productId: string): Promise<void> {
  await apiRequest("/users/cart/remove", {
    method: "POST", // Make sure this is POST, not DELETE as per the API docs
    body: JSON.stringify({ userId, productId }),
  })

  // Dispatch cart update event after successful removal
  dispatchCartUpdateEvent()
}

export async function updateCartItem(userId: string, productId: string, quantity: number): Promise<void> {
  await apiRequest("/users/cart/update", {
    method: "PUT",
    body: JSON.stringify({ userId, productId, quantity }),
  })

  // Dispatch cart update event after successful update
  dispatchCartUpdateEvent()
}

// Wishlist APIs
export async function fetchWishlistItems(userId: string): Promise<WishlistItem[]> {
  try {
    // Log the userId to ensure it's valid
    console.log("Fetching wishlist for userId:", userId)

    // Make the API request
    const response = await apiRequest<{ success: boolean; data: any[] }>(`/users/wishlist/list?userId=${userId}`)

    // Log the response to debug
    console.log("Wishlist API response:", response)

    // Check if the response has the expected structure
    if (!response.data || !Array.isArray(response.data)) {
      console.error("Unexpected wishlist response format:", response)
      return []
    }

    // Map the API response to our WishlistItem structure
    return response.data.map((item) => ({
      product: {
        _id: item.productId,
        name: item.name,
        price: item.price,
        description: item.description || "",
        category: item.category || "",
        material: item.material || "",
        grade: item.grade || "",
        images: [PLACEHOLDER_IMAGE], // Use custom placeholder image
      },
    }))
  } catch (error) {
    console.error("Error fetching wishlist items:", error)
    return []
  }
}

// Update the wishlist functions to match the API documentation
export async function addToWishlist(userId: string, productId: string): Promise<void> {
  await apiRequest("/users/wishlist/add", {
    method: "POST",
    body: JSON.stringify({ userId, productId }),
  })
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  await apiRequest("/users/wishlist/remove", {
    method: "DELETE", // Changed to DELETE as per the API docs
    body: JSON.stringify({ userId, productId }),
  })
}

// Contact form submission
export async function submitContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ message: string }> {
  const data = await apiRequest<{ success: boolean; data: { message: string } }>("/contact/submit", {
    method: "POST",
    body: JSON.stringify(formData),
  })
  return data.data
}

// Helper function to get the current user ID from the auth store
export const getCurrentUserId = (): string => {
  const user = useAuthStore.getState().user
  return user?._id || ""
}
