import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { CARS_MODULE } from "../modules/cars"
import type CarsModuleService from "../modules/cars/services/car-service"

/**
 * When an order is placed, mark matching seller_car submissions as sold.
 * We check whether any line item's product has a seller_car with matching product_id.
 */
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data.id
  if (!orderId) return

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const carsService = container.resolve<CarsModuleService>(CARS_MODULE)

    // Fetch order with its line items so we can get product IDs
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "items.product_id"],
      filters: { id: orderId },
    } as any)

    const order = (orders as any[])?.[0]
    if (!order) return

    const productIds: string[] = (order.items ?? [])
      .map((item: any) => item.product_id)
      .filter(Boolean)

    for (const productId of productIds) {
      try {
        await carsService.markSubmissionSoldByProductId(productId)
      } catch {
        // If no seller_car exists for this product, that's fine
      }
    }
  } catch (err) {
    console.error("[order-placed] Error updating seller_car status:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
