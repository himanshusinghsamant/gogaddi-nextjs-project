import { model } from "@medusajs/framework/utils"

const SellerCar = model.define("seller_car", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  title: model.text(),
  brand: model.text(),
  car_model: model.text(),
  car_type: model.text(),
  year: model.text(),
  fuel_type: model.text(),
  transmission: model.text(),
  km_driven: model.text(),
  city: model.text(),
  color: model.text(),
  engine: model.text(),
  mileage: model.text(),
  owner: model.text(),
  description: model.text(),
  images: model.json(),
  expected_price: model.number(),
  /** pending | approved | rejected | sold */
  status: model.text(),
  /** Medusa product ID — set after admin approves */
  product_id: model.text().nullable(),
  rejection_reason: model.text().nullable(),
})

export default SellerCar
