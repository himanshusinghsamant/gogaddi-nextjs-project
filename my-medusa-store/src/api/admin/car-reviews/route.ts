import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CARS_MODULE } from "../../../modules/cars"
import type CarsModuleService from "../../../modules/cars/services/car-service"

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  const status = toOptionalString((req.query as any)?.status)
  const flaggedRaw = toOptionalString((req.query as any)?.flagged)
  const productId = toOptionalString((req.query as any)?.product_id)

  const filters: Record<string, any> = {}
  if (status) filters.status = status
  if (productId) filters.product_id = productId
  if (flaggedRaw === "true") filters.is_flagged = true
  if (flaggedRaw === "false") filters.is_flagged = false

  const reviews = await carsService.listAllCarReviews(filters)
  const sorted = [...(reviews as any[])].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  )

  res.json({
    reviews: sorted.map((r) => ({
      id: r.id,
      product_id: r.product_id,
      reviewer_name: r.reviewer_name,
      rating: r.rating,
      review_text: r.review_text,
      status: r.status,
      is_flagged: r.is_flagged,
      flagged_words: r.flagged_words,
      created_at: r.created_at,
    })),
  })
}
