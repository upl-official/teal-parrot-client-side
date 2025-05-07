export interface Product {
  _id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  stock?: number
  category?: string
  material?: string
  grade?: string
  images: string[]
  coating?: string
  gem?: string
  size?: string
}

export interface CartItem {
  _id?: string
  product: Product
  quantity: number
}

export interface WishlistItem {
  _id?: string
  product: Product
}

export interface Category {
  _id: string
  name: string
}

export interface Material {
  _id: string
  material: string
}

export interface Grade {
  _id: string
  grade: string
}

export interface Address {
  _id: string
  user?: string
  userId?: string
  address: string
  state: string
  city: string
  pincode: string | number
  isDefault?: boolean
}

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  _id: string
  orderId?: string // Added orderId as an optional property
  user: User
  product: Product
  quantity: number
  address: Address
  status: string
  createdAt: string
  updatedAt?: string
  totalAmount?: number
  totalPrice?: number // Added to match OrderResponse
  shippingAddress?: Address // Added to match OrderResponse
  placedAt?: string // Added to match OrderResponse
  items?: Array<{ product: Product; quantity: number }> // Added to match OrderResponse
}
