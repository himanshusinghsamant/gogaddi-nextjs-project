import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { CARS_MODULE } from "../../../../../modules/cars"
import type CarsModuleService from "../../../../../modules/cars/services/car-service"

/**
 * GET /admin/products/:id/with-reviews
 * Returns the full product (same shape as default product API) with a
 * top-level "reviews" array from the cars module. Use this when you need
 * product + reviews in one response.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  const { data: products = [] } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "subtitle",
      "status",
      "external_id",
      "description",
      "handle",
      "is_giftcard",
      "discountable",
      "thumbnail",
      "collection_id",
      "type_id",
      "weight",
      "length",
      "height",
      "width",
      "hs_code",
      "origin_country",
      "mid_code",
      "material",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata",
      "type.*",
      "collection.*",
      "options.*",
      "options.values.*",
      "tags.*",
      "images.*",
      "categories.*",
      "sales_channels.*",
      "variants.*",
    ],
    filters: { id },
  })

  const product = (products as any[])[0]
  if (!product) {
    res.status(404).json({ message: "Product not found" })
    return
  }

  const reviews = await carsService.getCarReviewsForAdmin(id)
  const reviewsPayload = (reviews as any[]).map((r) => ({
    id: r.id,
    product_id: r.product_id,
    reviewer_name: r.reviewer_name,
    rating: r.rating,
    review_text: r.review_text,
    status: r.status,
    is_flagged: r.is_flagged,
    flagged_words: r.flagged_words,
    created_at: r.created_at,
  }))

  res.json({
    ...product,
    reviews: reviewsPayload,
  })
}
