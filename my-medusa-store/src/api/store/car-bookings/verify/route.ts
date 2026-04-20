import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CARS_MODULE } from "../../../../modules/cars"
import type CarsModuleService from "../../../../modules/cars/services/car-service"

/**
 * POST /store/car-bookings/verify
 * Verifies a booking via email token.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { token } = req.body as { token?: string }

  if (!token) {
    res.status(400).json({ message: "Verification token is required" })
    return
  }

  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)
  const booking = await carsService.getBookingByToken(token)

  if (!booking) {
    res.status(404).json({ message: "Invalid or expired verification token" })
    return
  }

  if (booking.is_email_verified) {
    res.json({
      message: "Email already verified. Your booking is pending admin confirmation.",
      booking: sanitize(booking),
    })
    return
  }

  await carsService.verifyBookingEmail(booking.id)

  res.json({
    message: "Email verified successfully! Your booking is now pending confirmation.",
    booking: { ...sanitize(booking), is_email_verified: true, status: "email_verified" },
  })
}

function sanitize(b: any) {
  return {
    id: b.id,
    car_id: b.car_id,
    car_title: b.car_title,
    name: b.name,
    email: b.email,
    phone: b.phone,
    city: b.city,
    preferred_date: b.preferred_date,
    preferred_time: b.preferred_time,
    message: b.message,
    status: b.status,
    is_email_verified: b.is_email_verified,
    created_at: b.created_at,
  }
}
