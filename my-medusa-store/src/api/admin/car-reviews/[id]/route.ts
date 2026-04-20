import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CARS_MODULE } from "../../../../modules/cars"
import type CarsModuleService from "../../../../modules/cars/services/car-service"

export async function DELETE(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id } = req.params
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)
  await (carsService as any).deleteCarReviews({ id })
  res.status(204).send()
}
