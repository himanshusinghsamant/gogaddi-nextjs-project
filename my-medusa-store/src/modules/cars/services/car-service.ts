import { MedusaService } from "@medusajs/framework/utils"
import CarFeature from "../models/car-feature"
import CarSpecification from "../models/car-specification"
import CarReview from "../models/car-review"
import CarRelated from "../models/car-related"
import SellerCar from "../models/seller-car"
import CarBooking from "../models/car-booking"

class CarsModuleService extends MedusaService({
  CarFeature,
  CarSpecification,
  CarReview,
  CarRelated,
  SellerCar,
  CarBooking,
}) {
  // ── Car Features ─────────────────────────────────────────────────────
  async addFeature(productId: string, feature: { feature_name: string; feature_value?: string }) {
    return this.createCarFeatures({ product_id: productId, ...feature } as any)
  }

  async addSpecification(
    productId: string,
    spec: { spec_group: string; spec_name: string; spec_value?: string }
  ) {
    return this.createCarSpecifications({ product_id: productId, ...spec } as any)
  }

  async addReview(
    productId: string,
    review: { reviewer_name?: string; rating: number; review_text?: string }
  ) {
    return this.createCarReviews({
      product_id: productId,
      reviewer_name: review.reviewer_name ?? "",
      rating: review.rating,
      review_text: review.review_text ?? "",
    } as any)
  }

  async addRelatedCar(productId: string, relatedProductId: string) {
    // Medusa generates pluralized helpers for the CarRelated model (createCarRelateds)
    return (this as any).createCarRelateds({
      product_id: productId,
      related_product_id: relatedProductId,
    } as any)
  }

  async getCarFeatures(productId: string) {
    return this.listCarFeatures({ product_id: productId })
  }

  async getCarSpecifications(productId: string) {
    return this.listCarSpecifications({ product_id: productId })
  }

  async getCarReviews(productId: string) {
    return this.listCarReviews({ product_id: productId })
  }

  async getRelatedCars(productId: string) {
    // And listCarRelateds for listing
    return (this as any).listCarRelateds({ product_id: productId })
  }

  // ── Seller Car Submissions ────────────────────────────────────────────
  async createSubmission(data: {
    customer_id: string
    title: string
    brand: string
    car_model: string
    car_type: string
    year: string
    fuel_type: string
    transmission: string
    km_driven: string
    city: string
    color: string
    engine: string
    mileage: string
    owner: string
    description: string
    images: string[]
    expected_price: number
  }) {
    return this.createSellerCars({
      ...data,
      status: "pending",
    } as any)
  }

  async listSubmissions(filters?: Record<string, any>) {
    return this.listSellerCars(filters ?? {})
  }

  async getSubmission(id: string) {
    const results = await this.listSellerCars({ id } as any)
    return (results as any[])[0] ?? null
  }

  async getSubmissionsByCustomer(customerId: string) {
    return this.listSellerCars({ customer_id: customerId } as any)
  }

  async updateSubmissionStatus(
    id: string,
    status: "pending" | "approved" | "rejected" | "sold",
    extra?: { product_id?: string; rejection_reason?: string }
  ) {
    return this.updateSellerCars({ id, status, ...extra } as any)
  }

  async markSubmissionSoldByProductId(productId: string) {
    const items = await this.listSellerCars({ product_id: productId } as any)
    if (!(items as any[]).length) return null
    const item = (items as any[])[0]
    return this.updateSellerCars({ id: item.id, status: "sold" } as any)
  }

  // ── Car Bookings (Test Drive) ─────────────────────────────────────────
  async createBooking(data: {
    customer_id?: string | null
    car_id: string
    car_title?: string | null
    name: string
    email: string
    phone: string
    city: string
    preferred_date: string
    preferred_time: string
    message?: string | null
    verification_token: string
  }) {
    return this.createCarBookings({
      customer_id: data.customer_id ?? null,
      car_id: data.car_id,
      car_title: data.car_title ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      message: data.message ?? null,
      verification_token: data.verification_token,
      status: "pending",
      is_email_verified: false,
    } as any)
  }

  async getBookingByToken(token: string) {
    const results = await this.listCarBookings({ verification_token: token } as any)
    return (results as any[])[0] ?? null
  }

  async getBooking(id: string) {
    const results = await this.listCarBookings({ id } as any)
    return (results as any[])[0] ?? null
  }

  async listAllBookings(filters?: Record<string, any>) {
    return this.listCarBookings(filters ?? {})
  }

  async verifyBookingEmail(id: string) {
    return this.updateCarBookings({ id, is_email_verified: true, status: "email_verified" } as any)
  }

  async updateBookingStatus(id: string, status: "confirmed" | "cancelled") {
    return this.updateCarBookings({ id, status } as any)
  }
}

export default CarsModuleService
