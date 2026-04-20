import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Resend } from "resend"
import { CARS_MODULE } from "../../../../../modules/cars"
import type CarsModuleService from "../../../../../modules/cars/services/car-service"

/**
 * POST /admin/car-bookings/:id/cancel
 * Cancels a test drive booking and notifies the customer.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id } = req.params
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  const booking = await carsService.getBooking(id)
  if (!booking) {
    res.status(404).json({ message: "Booking not found" })
    return
  }
  if (booking.status === "cancelled") {
    res.status(400).json({ message: "Booking is already cancelled" })
    return
  }

  await carsService.updateBookingStatus(id, "cancelled")

  await sendCancellationEmail(booking)

  res.json({ message: "Booking cancelled and customer notified.", booking_id: id })
}

async function sendCancellationEmail(booking: any) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[car-bookings/cancel] RESEND_API_KEY not set; skipping email.")
    return
  }

  const carLabel = booking.car_title || `Car (${booking.car_id})`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Test Drive Cancelled</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:24px;margin:0;">
  <div style="max-width:520px;margin:0 auto;">
    <div style="background:#dc2626;padding:20px 24px;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Test Drive Cancelled</h1>
      <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">GoGaddi — India's Trusted Car Marketplace</p>
    </div>
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
      <p style="color:#0f172a;font-size:15px;">Hello <strong>${escHtml(booking.name)}</strong>,</p>
      <p style="color:#475569;font-size:14px;">
        Your test drive request for <strong>${escHtml(carLabel)}</strong> has been cancelled.
      </p>
      <p style="color:#475569;font-size:14px;">
        If you would like to book another slot, you are welcome to visit GoGaddi anytime.
      </p>
      <p style="color:#94a3b8;font-size:12px;margin-top:20px;">— GoGaddi Team</p>
    </div>
  </div>
</body>
</html>`.trim()

  try {
    const from = process.env.RESEND_FROM || "GoGaddi <onboarding@resend.dev>"
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: booking.email,
      subject: `Test Drive Cancelled — ${carLabel}`,
      html,
    })
    if (error) console.error("[car-bookings/cancel] Resend error:", error)
  } catch (err) {
    console.error("[car-bookings/cancel] Exception sending email:", err)
  }
}

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
