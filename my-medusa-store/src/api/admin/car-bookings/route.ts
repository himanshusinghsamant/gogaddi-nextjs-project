import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CARS_MODULE } from "../../../modules/cars"
import type CarsModuleService from "../../../modules/cars/services/car-service"

/**
 * GET /admin/car-bookings?status=
 * Returns all test drive bookings. Filter by ?status= (pending|email_verified|confirmed|cancelled).
 */
export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { status } = req.query as Record<string, string>
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  const filters: Record<string, any> = {}
  if (status) filters.status = status

  const bookings = await carsService.listAllBookings(filters)

  res.json({
    bookings: (bookings as any[]).map(sanitize),
  })
}

function sanitize(b: any) {
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
