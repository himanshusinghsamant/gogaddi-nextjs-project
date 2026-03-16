import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Resend } from "resend"
import { CARS_MODULE } from "../../../../../modules/cars"
import type CarsModuleService from "../../../../../modules/cars/services/car-service"

/**
 * POST /admin/car-bookings/:id/confirm
 * Confirms a test drive booking and notifies the customer.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id } = req.params
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  const booking = await carsService.getBooking(id)
  if (!booking) {
    res.status(404).json({ message: "Booking not found" })
    return
  }
  if (booking.status === "confirmed") {
    res.status(400).json({ message: "Booking is already confirmed" })
    return
  }
  if (booking.status === "cancelled") {
    res.status(400).json({ message: "Cannot confirm a cancelled booking" })
    return
  }

  await carsService.updateBookingStatus(id, "confirmed")

  await sendConfirmationEmail(booking)

  res.json({ message: "Booking confirmed and customer notified.", booking_id: id })
}

async function sendConfirmationEmail(booking: any) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[car-bookings/confirm] RESEND_API_KEY not set; skipping email.")
    return
  }

  const carLabel = booking.car_title || `Car (${booking.car_id})`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Test Drive Confirmed</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:24px;margin:0;">
  <div style="max-width:520px;margin:0 auto;">
    <div style="background:#16a34a;padding:20px 24px;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Test Drive Confirmed!</h1>
      <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">GoGaddi — India's Trusted Car Marketplace</p>
    </div>
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
      <p style="color:#0f172a;font-size:15px;">Hello <strong>${escHtml(booking.name)}</strong>,</p>
      <p style="color:#475569;font-size:14px;">
        Your test drive for <strong>${escHtml(carLabel)}</strong> has been confirmed.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
        <tr style="background:#f1f5f9;">
          <td style="padding:8px 12px;color:#64748b;width:40%;">Date</td>
          <td style="padding:8px 12px;color:#0f172a;font-weight:600;">${escHtml(booking.preferred_date)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;color:#64748b;">Time</td>
          <td style="padding:8px 12px;color:#0f172a;font-weight:600;">${escHtml(booking.preferred_time)}</td>
        </tr>
        <tr style="background:#f1f5f9;">
          <td style="padding:8px 12px;color:#64748b;">City</td>
          <td style="padding:8px 12px;color:#0f172a;font-weight:600;">${escHtml(booking.city)}</td>
        </tr>
      </table>
      <p style="color:#475569;font-size:14px;">Our team will contact you shortly to share the exact location and any additional details.</p>
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
      subject: `Test Drive Confirmed — ${carLabel}`,
      html,
    })
    if (error) console.error("[car-bookings/confirm] Resend error:", error)
  } catch (err) {
    console.error("[car-bookings/confirm] Exception sending email:", err)
  }
}

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
