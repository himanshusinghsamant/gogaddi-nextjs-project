import type { AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { MedusaResponse } from "@medusajs/framework/http"
import { CARS_MODULE } from "../../../modules/cars"
import type CarsModuleService from "../../../modules/cars/services/car-service"

/** GET /store/seller-cars — returns the authenticated customer's own submissions */
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "Please sign in to view your submissions." })
    return
  }

  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)
  const submissions = await carsService.getSubmissionsByCustomer(customerId)

  res.json({
    submissions: (submissions as any[]).map((s) => ({
      id: s.id,
      title: s.title,
      brand: s.brand,
      car_model: s.car_model,
      year: s.year,
      fuel_type: s.fuel_type,
      transmission: s.transmission,
      city: s.city,
      expected_price: s.expected_price,
      status: s.status,
      product_id: s.product_id ?? null,
      rejection_reason: s.rejection_reason ?? null,
      images: s.images ?? [],
      created_at: s.created_at,
    })),
  })
}
