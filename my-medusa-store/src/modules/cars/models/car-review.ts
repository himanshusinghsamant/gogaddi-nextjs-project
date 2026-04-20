import { model } from "@medusajs/framework/utils"

const CarReview = model.define("car_review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  reviewer_name: model.text(),
  rating: model.number(),
  review_text: model.text(),
  status: model.text().default("published"),
  is_flagged: model.boolean().default(false),
  flagged_words: model.text().nullable(),
})

export default CarReview
