import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CARS_MODULE } from "../../../../../modules/cars"
import type CarsModuleService from "../../../../../modules/cars/services/car-service"

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id: productId } = req.params
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)
  const reviews = await carsService.getCarReviewsForAdmin(productId)
  res.json({
    reviews: (reviews as any[]).map((r) => ({
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

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id: productId } = req.params
  const { reviewer_name, rating, review_text } = req.body as any
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)
  const review = await carsService.addReview(productId, {
    reviewer_name: reviewer_name ?? "",
    rating: Number(rating) ?? 0,
    review_text: review_text ?? "",
  }, { bypassModeration: true, forceStatus: "published" })
  res.status(201).json({ review })
}
