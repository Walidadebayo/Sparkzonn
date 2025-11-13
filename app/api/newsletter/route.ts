import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const url = new URL("https://api.sender.net/v2/subscribers")

    const headers = {
      "Authorization": `Bearer ${process.env.SENDER_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }

    const data = {
      email: email,
      firstname: "Subscriber",
      groups: ["boJBxX"],
      trigger_automation: false,
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("Sender.net API error:", result)
      return NextResponse.json(
        { error: "Failed to subscribe to newsletter" },
        { status: response.status }
      )
    }

    if (result.success) {
      return NextResponse.json({
        message: "Successfully subscribed to newsletter",
        data: result.data
      })
    } else {
      console.error("Sender.net subscription failed:", result)
      return NextResponse.json(
        { error: "Failed to subscribe to newsletter" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}