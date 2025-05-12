export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  rating?: number
  numReviews?: number
  isFeatured?: boolean
  isNew?: boolean
  discount?: number
  discountPercentage?: number
  originalPrice?: number
  material?: string
  grade?: string
  coating?: string
  gem?: string
  size?: string
  sizes?: ProductSize[]
  variants?: ProductVariant[]
  specifications?: Record<string, string>
  createdAt?: string
  updatedAt?: string
}

export interface ProductVariant {
  _id: string
  name: string
  price?: number
  stock?: number
  images?: string[]
}

// Add this new interface for product sizes
export interface ProductSize {
  _id: string
  size: string
  price?: number
  stock?: number
  images?: string[]
}

// Add this interface for grouped products
export interface GroupedProduct extends Product {
  variants: Product[]
  selectedVariant: Product
  availableSizes: string[]
}

export interface Category {
  _id: string
  name: string
  description?: string
  image?: string
  productCount?: number
  slug?: string
  parent?: string
  children?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Material {
  _id: string
  material: string
}

export interface Grade {
  _id: string
  grade: string
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  isAdmin?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  _id: string
  product: Product
  quantity: number
  variant?: ProductVariant
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
  totalPrice: number
  createdAt?: string
  updatedAt?: string
}

export interface WishlistItem {
  _id: string
  product: Product
}

export interface Wishlist {
  _id: string
  user: string
  items: WishlistItem[]
  createdAt?: string
  updatedAt?: string
}

export interface Address {
  _id: string
  user: string
  name: string
  address: string
  city: string
  state: string
  pincode: number
  isDefault?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  _id: string
  user: string
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt?: string
  updatedAt?: string
  orderId?: string
  totalPrice?: number
  shippingAddress?: Address
  placedAt?: string
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
  variant?: ProductVariant
}

export enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export enum PaymentMethod {
  CreditCard = "credit_card",
  PayPal = "paypal",
  BankTransfer = "bank_transfer",
  CashOnDelivery = "cash_on_delivery",
}

export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
  Refunded = "refunded",
}

export interface Review {
  _id: string
  product: string
  user: User
  rating: number
  comment: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  error?: string
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  error?: string
  message?: string
}

export interface OrderResponse {
  _id: string
  orderId: string
  user: string
  items: OrderItem[]
  status: OrderStatus
  totalPrice: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingAddress: Address
  placedAt: string
  createdAt: string
  updatedAt: string
}

export interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sort?: "price_asc" | "price_desc" | "newest" | "rating"
  page?: number
  limit?: number
  search?: string
}
