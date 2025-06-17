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

export interface CouponListResponse {
  success: boolean
  data: {
    success: boolean
    data: Coupon[]
  }
}
