import type { Product, CartItem, WishlistItem, Category, Material, Grade, Address, Order, User } from "./types"
import { dispatchCartUpdateEvent } from "./cart-events"
import { DEV_MODE, getFallbackWishlistItems } from "./dev-fallbacks"
import { handleApiError } from "./api-error-handler"
import { useAuthStore } from "./auth"

// Base URL for API
const API_BASE_URL = "https://backend-project-r734.onrender.com/api/v1"

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

// Add these interfaces at the top of the file
export interface Coupon {
  _id: string
  code: string
  offerPercentage: number
  validFrom: string
  validUntil: string
  type: "normal" | "product"
  minimumOrderAmount: number
  isActive: boolean
  applicableProducts: string | number
  products?: Array<{
    _id: string
    name: string
    price: number
  }>
}

export interface CouponValidationResult {
  isValid: boolean
  coupon?: Coupon
  message: string
  discountAmount?: number
}

// Coupon validation response interface
export interface CouponValidationResponse {
  _id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  isValid: boolean
  message?: string
}

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

// Get auth token from store
const getAuthToken = () => {
  return useAuthStore.getState().token
}

// Helper function for API requests with error handling
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    // Log the request for debugging
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      hasToken: !!token,
      body: options.body ? JSON.parse(options.body as string) : undefined,
    })

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `HTTP error! status: ${response.status}`

      try {
        const errorData = JSON.parse(errorText)
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map((err: any) => err.message).join(", ")
        }
      } catch (e) {
        // If parsing fails, use the raw error text or default message
        errorMessage = errorText || errorMessage
      }

      throw new Error(errorMessage)
    }

    const responseData = await response.json()

    // Log the response for debugging
    console.log(`API response from: ${API_BASE_URL}${endpoint}`, responseData)

    // Check if the API returned success: false
    if (responseData.success === false) {
      const error = new Error(responseData.message || "API request failed")
      // @ts-ignore - Add status code to error object
      error.statusCode = response.status
      throw error
    }

    return responseData
  } catch (error) {
    // Use our error handler to get a structured error
    const apiError = handleApiError(error, `API Request: ${endpoint}`)
    console.error(`API Error (${endpoint}):`, apiError)
    throw error
  }
}

// Process product data to ensure image URLs are complete
function processProductData(product: any): Product {
  return {
    ...product,
    images:
      product.images?.map(ensureFullImageUrl) ||
      (product.image ? [ensureFullImageUrl(product.image)] : [PLACEHOLDER_IMAGE]),
  }
}

// Product APIs
export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  const endpoint = categoryId ? `/product/list/?categoryId=${categoryId}` : "/product/list"

  const data = await apiRequest<{ success: boolean; data: { products: any[] } }>(endpoint)
  return data.data.products.map(processProductData)
}

// Search products API
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim() === "") {
    return []
  }

  const endpoint = `/product/list/?searchQuery=${encodeURIComponent(query.trim())}`

  try {
    const data = await apiRequest<{ success: boolean; data: { products: any[] } }>(endpoint)
    return data.data.products.map(processProductData)
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
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

// New function to fetch complete product details for multiple products
export async function fetchCompleteProductDetails(productIds: string[]): Promise<Record<string, Product>> {
  if (!productIds.length) return {}

  try {
    const productDetailsMap: Record<string, Product> = {}

    // Fetch details for each product in parallel
    await Promise.all(
      productIds.map(async (productId) => {
        try {
          const product = await fetchProductById(productId)
          productDetailsMap[productId] = product
        } catch (error) {
          console.error(`Error fetching details for product ${productId}:`, error)
        }
      }),
    )

    return productDetailsMap
  } catch (error) {
    console.error("Error fetching complete product details:", error)
    return {}
  }
}

export async function fetchSimilarProducts(category?: string): Promise<Product[]> {
  try {
    // If category is provided, fetch products from that category
    const endpoint = category ? `/product/list/?category=${encodeURIComponent(category)}` : "/product/list"

    const data = await apiRequest<{ success: boolean; data: { products: any[] } }>(endpoint)

    // Process and return the products
    return data.data.products.map(processProductData)
  } catch (error) {
    console.error("Error fetching similar products:", error)
    return []
  }
}

// Add this function to fetch sizes
export async function fetchSizes(): Promise<string[]> {
  try {
    const response = await apiRequest<{ success: boolean; data: string[] }>("/product/sizes")
    return response.data
  } catch (error) {
    console.error("Error fetching sizes:", error)

    // If the API doesn't support size fetching yet, extract sizes from products
    const products = await fetchProducts()
    const sizeSet = new Set<string>()

    products.forEach((product) => {
      if (product.size) {
        sizeSet.add(product.size)
      }
    })

    return Array.from(sizeSet).sort()
  }
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

// Coupon APIs
// Update the coupon validation function
export async function validateCoupon(
  couponCode: string,
  orderAmount: number,
  cartItems: CartItem[] = [],
): Promise<CouponValidationResult> {
  try {
    console.log("Validating coupon:", { couponCode, orderAmount, cartItemsCount: cartItems.length })

    // Fetch all available coupons
    const response = await apiRequest<{
      success: boolean
      data: {
        success: boolean
        data: Coupon[]
      }
    }>("/coupon/coupon-list/")

    if (!response.success || !response.data.success) {
      return {
        isValid: false,
        message: "Unable to validate coupon at this time. Please try again.",
      }
    }

    const coupons = response.data.data
    console.log("Available coupons:", coupons)

    // Find the coupon with matching code (case-insensitive)
    const coupon = coupons.find((c) => c.code.toLowerCase() === couponCode.toLowerCase())

    if (!coupon) {
      return {
        isValid: false,
        message: "Invalid coupon code. Please check and try again.",
      }
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return {
        isValid: false,
        message: "This coupon is no longer active.",
      }
    }

    // Check validity dates
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)

    if (now < validFrom) {
      return {
        isValid: false,
        message: `This coupon is not yet valid. Valid from ${validFrom.toLocaleDateString()}.`,
      }
    }

    if (now > validUntil) {
      return {
        isValid: false,
        message: `This coupon has expired on ${validUntil.toLocaleDateString()}.`,
      }
    }

    // Check minimum order amount
    if (orderAmount < coupon.minimumOrderAmount) {
      return {
        isValid: false,
        message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon.`,
      }
    }

    // Check product applicability for product-specific coupons
    if (coupon.type === "product" && coupon.products && cartItems.length > 0) {
      const applicableProductIds = coupon.products.map((p) => p._id)
      const hasApplicableProducts = cartItems.some((item) => applicableProductIds.includes(item.product._id))

      if (!hasApplicableProducts) {
        return {
          isValid: false,
          message: "This coupon is not applicable to the products in your cart.",
        }
      }

      // Calculate discount only for applicable products
      const applicableAmount = cartItems
        .filter((item) => applicableProductIds.includes(item.product._id))
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0)

      const discountAmount = Math.round((applicableAmount * coupon.offerPercentage) / 100)

      return {
        isValid: true,
        coupon,
        message: `Coupon applied! You saved ₹${discountAmount} (${coupon.offerPercentage}% off applicable products).`,
        discountAmount,
      }
    }

    // For normal coupons, apply to entire order
    const discountAmount = Math.round((orderAmount * coupon.offerPercentage) / 100)

    return {
      isValid: true,
      coupon,
      message: `Coupon applied! You saved ₹${discountAmount} (${coupon.offerPercentage}% off).`,
      discountAmount,
    }
  } catch (error) {
    console.error("Error validating coupon:", error)
    return {
      isValid: false,
      message: "Unable to validate coupon. Please try again later.",
    }
  }
}

// Add function to fetch all coupons (for admin or display purposes)
export async function fetchAllCoupons(): Promise<Coupon[]> {
  try {
    const response = await apiRequest<{
      success: boolean
      data: {
        success: boolean
        data: Coupon[]
      }
    }>("/coupon/coupon-list/")

    if (response.success && response.data.success) {
      return response.data.data
    }

    return []
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return []
  }
}

export async function applyCoupon(couponCode: string, orderAmount: number): Promise<CouponValidationResponse> {
  return validateCoupon(couponCode, orderAmount)
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

// Add user address function
export async function addUserAddress(
  userId: string,
  addressData: {
    address: string
    state: string
    city: string
    pincode: string
  },
): Promise<any> {
  try {
    const response = await apiRequest("/users/address/add", {
      method: "POST",
      body: JSON.stringify({
        userId,
        ...addressData,
      }),
    })
    return response.data || response
  } catch (error) {
    console.error("Error adding user address:", error)
    throw error
  }
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
    const data = await apiRequest<{ success: boolean; data: { orders: any[] } }>(`/users/order/list?user=${userId}`)

    // The new API response structure has orders nested in data.orders
    return data.data.orders || []
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
  productId?: string
  quantity?: number
  addressId: string
  couponId?: string
  shippingCost?: number
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
    console.log("Fetching cart items for userId:", userId)

    // Check if userId is valid
    if (!userId) {
      console.warn("fetchCartItems called with invalid userId")
      return []
    }

    const data = await apiRequest<{ success: boolean; data: any }>(`/users/cart/list?userId=${userId}`)

    console.log("Raw cart API response:", data)

    // Handle different response structures
    let cartItems = []
    const responseData = data.data

    // Handle various response formats
    if (!responseData) {
      console.warn("No data property in cart response")
      return []
    }

    // Check if responseData has items property
    if (responseData.items && Array.isArray(responseData.items)) {
      cartItems = responseData.items
    }
    // Check if responseData is directly an array
    else if (Array.isArray(responseData)) {
      cartItems = responseData
    }
    // Check if it's an empty object or error response
    else if (typeof responseData === "object" && Object.keys(responseData).length === 0) {
      console.info("Cart is empty for user:", userId)
      return []
    }
    // Handle single item response
    else if (responseData.productId || responseData._id) {
      cartItems = [responseData]
    } else {
      console.warn("Unexpected cart response format:", responseData)
      return []
    }

    console.log("Processed cart items:", cartItems)

    // If cart is empty, return empty array
    if (!cartItems || cartItems.length === 0) {
      console.info("No items in cart for user:", userId)
      return []
    }

    // Extract product IDs from cart items, handling different field names
    const productIds = cartItems.map((item: any) => item.productId || item.product?._id || item._id).filter(Boolean) // Remove any undefined/null values

    console.log("Product IDs to fetch:", productIds)

    // If no valid product IDs, return empty array
    if (productIds.length === 0) {
      console.warn("No valid product IDs found in cart items")
      return []
    }

    // Fetch complete product details for all products in the cart
    const productDetailsMap = await fetchCompleteProductDetails(productIds)

    console.log("Product details map:", productDetailsMap)

    // Map the API response to our CartItem structure with enhanced product details
    return cartItems
      .map((item: any) => {
        const productId = item.productId || item.product?._id || item._id
        const enhancedProduct = productDetailsMap[productId] || {
          _id: productId || "unknown-id",
          name: item.name || item.product?.name || "Product Name Unavailable",
          price: item.price || item.product?.price || 0,
          description: item.description || item.product?.description || "",
          category: item.category || item.product?.category || "",
          material: item.material || item.product?.material || "",
          grade: item.grade || item.product?.grade || "",
          images: item.images?.map(ensureFullImageUrl) ||
            item.product?.images?.map(ensureFullImageUrl) || [PLACEHOLDER_IMAGE],
        }

        return {
          product: enhancedProduct,
          quantity: item.quantity || 1,
        }
      })
      .filter((item) => item.product._id !== "unknown-id") // Filter out items with unknown product IDs
  } catch (error) {
    console.error("Error fetching cart items:", error)

    // If it's an authentication error, don't return fallback data
    if (error instanceof Error && error.message.includes("Authentication failed")) {
      throw error
    }

    return []
  }
}

// Update the cart functions to use the new specific APIs
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

// New specific quantity management functions
export async function increaseCartQuantity(userId: string, productId: string): Promise<any> {
  try {
    const response = await apiRequest("/users/cart/increase-quantity", {
      method: "POST",
      body: JSON.stringify({
        userId,
        productId,
      }),
    })

    // Dispatch cart update event after successful increase
    dispatchCartUpdateEvent()

    return response
  } catch (error) {
    console.error("Error increasing cart quantity:", error)
    throw error
  }
}

export async function decreaseCartQuantity(userId: string, productId: string): Promise<any> {
  try {
    const response = await apiRequest("/users/cart/decrease-quantity", {
      method: "POST",
      body: JSON.stringify({
        userId,
        productId,
      }),
    })

    // Dispatch cart update event after successful decrease
    dispatchCartUpdateEvent()

    return response
  } catch (error) {
    console.error("Error decreasing cart quantity:", error)
    throw error
  }
}

// Keep the old updateCartItem function for backward compatibility
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

    // Check if userId is valid
    if (!userId) {
      console.warn("fetchWishlistItems called with invalid userId")
      return DEV_MODE ? getFallbackWishlistItems() : []
    }

    // Make the API request
    const response = await apiRequest<{ success: boolean; data: any }>(`/users/wishlist/list?userId=${userId}`)

    // Log the response to debug
    console.log("Wishlist API response:", response)

    // Handle different response formats
    if (!response.data) {
      console.warn("Wishlist API returned no data property:", response)
      return DEV_MODE ? getFallbackWishlistItems() : []
    }

    // If data is an empty object
    if (
      typeof response.data === "object" &&
      (Object.keys(response.data).length === 0 || (response.data.success === false && "message" in response.data))
    ) {
      console.info("Wishlist is empty for user:", userId)
      return DEV_MODE ? getFallbackWishlistItems() : []
    }

    // Extract product IDs from wishlist items
    let wishlistItems = []
    if (Array.isArray(response.data)) {
      wishlistItems = response.data
    } else if (response.data.items && Array.isArray(response.data.items)) {
      wishlistItems = response.data.items
    } else {
      wishlistItems = [response.data]
    }

    const productIds = wishlistItems.map((item: any) => item.productId || item._id)

    // Fetch complete product details for all products in the wishlist
    const productDetailsMap = await fetchCompleteProductDetails(productIds)

    // Map the API response to our WishlistItem structure with enhanced product details
    return wishlistItems.map((item: any) => {
      const productId = item.productId || item._id
      const enhancedProduct = productDetailsMap[productId] || {
        _id: productId || "unknown-id",
        name: item.name || "Product Name Unavailable",
        price: item.price || 0,
        description: item.description || "",
        category: item.category || "",
        material: item.material || "",
        grade: item.grade || "",
        images: [PLACEHOLDER_IMAGE],
      }

      return {
        product: enhancedProduct,
      }
    })
  } catch (error) {
    console.error("Error fetching wishlist items:", error)
    // Return fallback data in development or empty array in production
    return DEV_MODE ? getFallbackWishlistItems() : []
  }
}

// Helper function to map API response to WishlistItem
function mapWishlistItem(item: any): WishlistItem {
  return {
    product: {
      _id: item.productId || item._id || "unknown-id",
      name: item.name || "Product Name Unavailable",
      price: item.price || 0,
      description: item.description || "",
      category: item.category || "",
      material: item.material || "",
      grade: item.grade || "",
      images: item.images?.map(ensureFullImageUrl) || [PLACEHOLDER_IMAGE],
    },
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

// Add the password update function
export async function updateUserPassword(userId: string, oldPassword: string, newPassword: string): Promise<any> {
  try {
    const data = await apiRequest<{ success: boolean; data: any }>("/users/user/update", {
      method: "PUT",
      body: JSON.stringify({
        userId,
        oldPassword,
        password: newPassword,
      }),
    })
    return data
  } catch (error) {
    console.error("Error updating password:", error)
    throw error
  }
}
