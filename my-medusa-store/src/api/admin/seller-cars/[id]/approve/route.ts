import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { Resend } from "resend"
import { CARS_MODULE } from "../../../../../modules/cars"
import type CarsModuleService from "../../../../../modules/cars/services/car-service"

/**
 * POST /admin/seller-cars/:id/approve
 * Approves a seller car submission and creates a Medusa product.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id } = req.params
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  const submission = await carsService.getSubmission(id)
  if (!submission) {
    res.status(404).json({ message: "Submission not found" })
    return
  }
  if (submission.status === "approved") {
    res.status(400).json({ message: "This submission is already approved" })
    return
  }

  // ── Create Medusa product ────────────────────────────────────────────
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)

  const salesChannels = await salesChannelService.listSalesChannels({ name: "Default Sales Channel" })
  const defaultSalesChannelId = salesChannels[0]?.id

  const { data: collections = [] } = submission.brand
    ? await query.graph({
        entity: "product_collection",
        fields: ["id", "title"],
        filters: { title: submission.brand },
      } as any)
    : { data: [] }
  const collectionId = (collections as any[])[0]?.id ?? undefined

  const handle = `user-${Date.now()}-${submission.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`
  const priceAmountINR = Number(submission.expected_price) || 0

  const productInput: any = {
    title: submission.title,
    handle,
    description: submission.description ?? "",
    status: ProductStatus.PUBLISHED,
    metadata: {
      model: submission.car_model ?? "",
      car_type: submission.car_type ?? "Used",
      fuel_type: submission.fuel_type ?? "",
      transmission: submission.transmission ?? "",
      year: submission.year ?? "",
      km_driven: submission.km_driven ?? "",
      color: submission.color ?? "",
      engine: submission.engine ?? "",
      mileage: submission.mileage ?? "",
      owner: submission.owner ?? "",
      city: submission.city ?? "",
      customer_id: submission.customer_id,
      seller_car_id: submission.id,
    },
    ...(collectionId && { collection_id: collectionId }),
    ...(defaultSalesChannelId && { sales_channels: [{ id: defaultSalesChannelId }] }),
    images: (Array.isArray(submission.images) ? submission.images : []).map((url: string) => ({ url })),
    options: [
      { title: "Fuel Type", values: [submission.fuel_type || "Petrol"] },
      { title: "Transmission", values: [submission.transmission || "Manual"] },
    ],
    variants: [
      {
        title: `${submission.fuel_type || "Petrol"} / ${submission.transmission || "Manual"}`,
        options: {
          "Fuel Type": submission.fuel_type || "Petrol",
          "Transmission": submission.transmission || "Manual",
        },
        manage_inventory: true,
        inventory_quantity: 1,
        prices: [
          { currency_code: "inr", amount: priceAmountINR },
          { currency_code: "usd", amount: Math.round(priceAmountINR / 84) },
        ],
      },
    ],
  }

  let productId: string
  try {
    const result = await createProductsWorkflow(req.scope).run({
      input: { products: [productInput] },
    })
    const created = result?.result?.[0]
    productId = created?.id
  } catch (err: any) {
    res.status(500).json({ message: `Failed to create product: ${err?.message ?? "Unknown error"}` })
    return
  }

  // ── Update submission status ─────────────────────────────────────────
  await carsService.updateSubmissionStatus(id, "approved", { product_id: productId })

  // ── Notify seller via email (non-blocking) ───────────────────────────
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "GoGaddi <onboarding@resend.dev>"
  const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:6001"
  const countryCode = process.env.STOREFRONT_COUNTRY_CODE || "in"

  if (apiKey) {
    try {
      // Try to get customer email from Medusa
      const customerService = req.scope.resolve(Modules.CUSTOMER) as any
      const customer = await customerService.retrieveCustomer(submission.customer_id).catch(() => null)
      const sellerEmail = customer?.email
      if (sellerEmail) {
        const resend = new Resend(apiKey)
        await resend.emails.send({
          from,
          to: sellerEmail,
          subject: `Your Car Listing Is Live — ${submission.title}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;padding:24px;max-width:520px;margin:0 auto;background:#f8fafc;">
  <div style="background:#16a34a;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">Your Car Is Now Live!</h1>
    <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">GoGaddi Marketplace</p>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
    <p style="color:#0f172a;font-size:15px;">Great news! Your car listing <strong>${submission.title}</strong> has been approved and is now live on GoGaddi.</p>
    <p style="margin-top:20px;">
      <a href="${storefrontUrl}/${countryCode}/cars/${handle}" style="display:inline-block;padding:12px 24px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        View Your Listing
      </a>
    </p>
    <p style="color:#64748b;font-size:13px;margin-top:20px;">Buyers can now contact you directly through the platform.</p>
  </div>
</body>
</html>
          `.trim(),
        })
      }
    } catch (err) {
      console.error("[approve] Failed to send seller notification:", err)
    }
  }

  res.json({
    message: "Submission approved and product created successfully",
    submission_id: id,
    product_id: productId,
    product_handle: handle,
  })
}
