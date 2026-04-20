import { NextRequest, NextResponse } from "next/server"
import { getAuthHeaders } from "@lib/data/cookies"

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

/**
 * POST /api/car-bookings
 * Proxies to Medusa POST /store/car-bookings with auth. Only logged-in customers can book.
 */
export async function POST(req: NextRequest) {
  const authHeaders = await getAuthHeaders()
  const hasAuth = "authorization" in authHeaders && !!authHeaders.authorization

  if (!hasAuth) {
    return NextResponse.json(
      { message: "Please log in to book a test drive." },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    )
  }

  const url = `${BACKEND_URL.replace(/\/$/, "")}/store/car-bookings`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authHeaders as Record<string, string>),
  }
  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
