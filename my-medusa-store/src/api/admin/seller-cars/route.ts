import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CARS_MODULE } from "../../../modules/cars"
import type CarsModuleService from "../../../modules/cars/services/car-service"

/** GET /admin/seller-cars?status=pending
 *  Returns all seller car submissions. Filter by ?status= (pending|approved|rejected|sold) */
export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { status } = req.query as Record<string, string>
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)
  const filters: Record<string, any> = {}
  if (status) filters.status = status

  const submissions = await carsService.listSubmissions(filters)

  res.json({
    submissions: (submissions as any[]).map((s) => ({
      id: s.id,
      customer_id: s.customer_id,
      title: s.title,
      brand: s.brand,
      car_model: s.car_model,
      year: s.year,
      fuel_type: s.fuel_type,
      transmission: s.transmission,
      km_driven: s.km_driven,
      city: s.city,
      expected_price: s.expected_price,
      status: s.status,
      product_id: s.product_id ?? null,
      rejection_reason: s.rejection_reason ?? null,
      images: s.images ?? [],
      description: s.description,
      color: s.color,
      engine: s.engine,
      mileage: s.mileage,
      owner: s.owner,
      car_type: s.car_type,
      created_at: s.created_at,
    })),
  })
}
