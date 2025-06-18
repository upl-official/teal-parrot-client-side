import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Local failure endpoint - forwarding to backend:", body)

    // Forward the request to the actual backend
    const backendResponse = await fetch("https://backend-project-r734.onrender.com/api/v1/users/payment/failure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("Backend error response:", errorText)
      throw new Error(`Backend error: ${backendResponse.status} - ${errorText}`)
    }

    const result = await backendResponse.json()
    console.log("Backend failure response:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error forwarding to backend:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process payment failure",
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
