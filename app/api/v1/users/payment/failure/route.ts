import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Payment failure request received:", body)

    // Validate required fields
    if (!body.txnid) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction ID is required",
        },
        { status: 400 },
      )
    }

    // Simulate the failure response structure matching the provided format
    const failureResponse = {
      success: true,
      data: {
        success: false,
        message: "Payment failed",
        order: {
          shippingAddress: {
            address: "Kanjirampara",
            state: "Kerala",
            city: "Tvpm",
            pincode: 695030,
          },
          _id: body.txnid || "68514f97b25c02d075ca9393",
          user: "66ed14896113081e420029cb",
          items: [
            {
              product: {
                _id: "68454996a4e7cb66dda15d96",
                name: "MIRA",
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
              quantity: 3,
              _id: "68514f97b25c02d075ca9394",
            },
          ],
          totalPrice: 5857.3,
          status: "cancelled",
          paymentStatus: "failed",
          couponApplied: {
            couponId: "682226bef692bed252dc0a0d",
            discountAmount: 539.7,
            originalPrice: 6397,
            couponType: "normal",
            eligibleProducts: [],
            _id: "68514f97b25c02d075ca9395",
          },
          shippingCost: 1000,
          placedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
      },
    }

    console.log("Sending failure response:", failureResponse)
    return NextResponse.json(failureResponse)
  } catch (error) {
    console.error("Error processing payment failure:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while processing payment failure",
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
      message: "Method not allowed. Use POST to process payment failure.",
    },
    { status: 405 },
  )
}
