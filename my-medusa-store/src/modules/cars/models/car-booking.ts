import { model } from "@medusajs/framework/utils"

const CarBooking = model.define("car_booking", {
  id: model.id().primaryKey(),
  /** Logged-in customer id when booking was created; links booking to account. */
  customer_id: model.text().nullable(),
  car_id: model.text(),
  car_title: model.text().nullable(),
  name: model.text(),
  email: model.text(),
  phone: model.text(),
  city: model.text(),
  preferred_date: model.text(),
  preferred_time: model.text(),
  message: model.text().nullable(),
  /** pending | email_verified | confirmed | cancelled */
  status: model.text(),
  verification_token: model.text(),
  is_email_verified: model.boolean(),
})

export default CarBooking
