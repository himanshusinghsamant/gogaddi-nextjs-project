import { MedusaService } from "@medusajs/framework/utils"
import CarFeature from "../models/car-feature"
import CarSpecification from "../models/car-specification"
import CarReview from "../models/car-review"
import CarRelated from "../models/car-related"
import SellerCar from "../models/seller-car"

class CarsModuleService extends MedusaService({
  CarFeature,
  CarSpecification,
  CarReview,
  CarRelated,
  SellerCar,
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
    return this.createCarRelated({ product_id: productId, related_product_id: relatedProductId } as any)
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
    return this.listCarRelated({ product_id: productId })
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
}

export default CarsModuleService
