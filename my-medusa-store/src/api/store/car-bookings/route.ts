import crypto from "crypto"
import type { AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { Resend } from "resend"
import { CARS_MODULE } from "../../../modules/cars"
import type CarsModuleService from "../../../modules/cars/services/car-service"

function sanitizeBooking(b: any) {
  return {
    id: b.id,
    car_id: b.car_id,
    car_title: b.car_title ?? null,
    name: b.name,
    email: b.email,
    phone: b.phone,
    city: b.city,
    preferred_date: b.preferred_date,
    preferred_time: b.preferred_time,
    message: b.message ?? null,
    status: b.status,
    is_email_verified: b.is_email_verified,
    created_at: b.created_at,
    updated_at: b.updated_at,
  }
}

/**
 * GET /store/car-bookings
 * Returns test drive bookings for the authenticated customer (by customer_id, or by email for legacy rows).
 */
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  const customerId = req.auth_context?.actor_id as string | undefined
  if (!customerId) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  // Bookings linked to this account
  const byCustomerId = (await carsService.listAllBookings({ customer_id: customerId })) as any[]

  // Legacy bookings (no customer_id) matched by email so they still show
  const customerService = req.scope.resolve(Modules.CUSTOMER) as any
  const customer = await customerService.retrieveCustomer(customerId).catch(() => null)
  let byEmail: any[] = []
  if (customer?.email) {
    const allByEmail = (await carsService.listAllBookings({ email: customer.email })) as any[]
    byEmail = allByEmail.filter((b) => b.customer_id == null)
  }

  const seen = new Set<string>()
  const bookings = [...byCustomerId, ...byEmail].filter((b) => {
    if (seen.has(b.id)) return false
    seen.add(b.id)
    return true
  })

  // Sort by created_at descending
  bookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  res.json({
    bookings: bookings.map(sanitizeBooking),
  })
}

/**
 * POST /store/car-bookings
 * Creates a test drive booking and sends a verification email.
 */
export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  const body = req.body as Record<string, any>

  const { car_id, car_title, name, email, phone, city, preferred_date, preferred_time, message } = body

  if (!car_id || !name || !email || !phone || !city || !preferred_date || !preferred_time) {
    res.status(400).json({ message: "Missing required fields: car_id, name, email, phone, city, preferred_date, preferred_time" })
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email address" })
    return
  }

  const customerId = req.auth_context?.actor_id as string | undefined

  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  const verification_token = crypto.randomBytes(32).toString("hex")

  const booking = await carsService.createBooking({
    customer_id: customerId ?? null,
    car_id,
    car_title: car_title ?? null,
    name,
    email,
    phone,
    city,
    preferred_date,
    preferred_time,
    message: message ?? null,
    verification_token,
  })

  await sendVerificationEmail({ name, email, token: verification_token, car_title })

  res.status(201).json({
    message: "Booking created. Please check your email to verify your booking.",
    booking_id: (booking as any).id,
  })
}

async function sendVerificationEmail({
  name,
  email,
  token,
  car_title,
}: {
  name: string
  email: string
  token: string
  car_title?: string | null
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[car-bookings] RESEND_API_KEY not set; skipping verification email.")
    console.info("[car-bookings] Verification token (dev):", token)
    return
  }

  const storefrontUrl = (process.env.STOREFRONT_URL || "http://localhost:3000").replace(/\/$/, "")
  const countryCode = process.env.STOREFRONT_COUNTRY_CODE || "in"
  const verifyUrl = `${storefrontUrl}/${countryCode}/verify-booking?token=${token}`

  const carLabel = car_title ? ` for <strong>${escHtml(car_title)}</strong>` : ""

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verify Your Test Drive Booking</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:24px;margin:0;">
  <div style="max-width:520px;margin:0 auto;">
    <div style="background:#1d4ed8;padding:20px 24px;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Verify Your Test Drive Booking</h1>
      <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">GoGaddi — India's Trusted Car Marketplace</p>
    </div>
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
      <p style="color:#0f172a;font-size:15px;">Hi <strong>${escHtml(name)}</strong>,</p>
      <p style="color:#475569;font-size:14px;">
        Thank you for booking a free test drive${carLabel} on GoGaddi.
        Please verify your email address to complete your booking.
      </p>
      <p style="margin:24px 0;">
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 28px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
          Verify Email &amp; Confirm Booking
        </a>
      </p>
      <p style="color:#94a3b8;font-size:12px;">This link will expire in 24 hours. If you did not request this, you can ignore this email.</p>
      <p style="color:#94a3b8;font-size:12px;">— GoGaddi Team</p>
    </div>
  </div>
</body>
</html>`.trim()

  try {
    const from = process.env.RESEND_FROM || "GoGaddi <onboarding@resend.dev>"
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: "Verify Your Test Drive Booking — GoGaddi",
      html,
    })
    if (error) {
      console.error("[car-bookings] Failed to send verification email:", error)
      console.info("[car-bookings] Verification token (dev):", token)
    }
  } catch (err) {
    console.error("[car-bookings] Exception sending verification email:", err)
    console.info("[car-bookings] Verification token (dev):", token)
  }
}

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
