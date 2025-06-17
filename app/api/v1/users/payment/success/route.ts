import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Payment success request received:", body)

    // Validate required fields
    const requiredFields = ["txnid", "amount", "productinfo", "firstname", "email", "status", "hash"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      console.warn("Missing required fields:", missingFields)
    }

    // Simulate the success response structure matching the provided format
    const successResponse = {
      success: true,
      data: {
        success: true,
        message: "Payment successful and stock updated",
        order: {
          shippingAddress: {
            address: "Kanjirampara",
            state: "Kerala",
            city: "Tvpm",
            pincode: 695030,
          },
          paymentDetails: {
            transactionId: body.txnid || "68513e15b25c02d075ca75b6",
            paymentMethod: "PayU",
            paymentDate: new Date().toISOString(),
          },
          _id: body.txnid || "68513e15b25c02d075ca75b6",
          user: "66ed14896113081e420029cb",
          items: [
            {
              product: {
                _id: "68454996a4e7cb66dda15d96",
                name: body.productinfo || "MIRA",
                price: 1799,
                description:
                  "Graceful and radiant, MIRA draws inspiration from the gentle elegance of a blooming flower. With its graceful silhouette and radiant form, MIRA adds a touch of timeless charm to your everyday style. Delicate yet distinctive — a piece you'll reach for again and again.",
                image:
                  "https://teal-parrot.s3.eu-north-1.amazonaws.com/products/2d1a4ddf-2863-40e2-ad67-f9362bf4135c.webp",
                category: "Rings",
                material: "Sterling Silver",
                grade: "925",
                gem: "Zircon",
                coating: "Rhodium Plated",
                size: "5",
              },
              quantity: 1,
              _id: "68513e15b25c02d075ca75b7",
            },
          ],
          totalPrice: Number.parseFloat(body.amount) || 1769.1,
          status: "confirmed",
          paymentStatus: "completed",
          couponApplied: {
            couponId: "682226bef692bed252dc0a0d",
            discountAmount: 179.9,
            originalPrice: 1949,
            couponType: "normal",
            eligibleProducts: [],
            _id: "68513e15b25c02d075ca75b8",
          },
          shippingCost: 150,
          placedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
      },
    }

    console.log("Sending success response:", successResponse)
    return NextResponse.json(successResponse)
  } catch (error) {
    console.error("Error processing payment success:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while processing payment success",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Method not allowed. Use POST to process payment success.",
    },
    { status: 405 },
  )
}
