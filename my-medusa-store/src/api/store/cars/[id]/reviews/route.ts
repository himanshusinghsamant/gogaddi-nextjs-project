import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Resend } from "resend"
import { CARS_MODULE } from "../../../../../modules/cars"
import type CarsModuleService from "../../../../../modules/cars/services/car-service"

function mapReview(r: any) {
  return {
    id: r.id,
    reviewer_name: r.reviewer_name,
    rating: r.rating,
    review_text: r.review_text,
    created_at: r.created_at,
  }
}

function escapeHtml(value: string): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function getReviewNotificationHtml(data: {
  productId: string
  reviewerName: string
  rating: number
  reviewText: string
  status: string
  isFlagged: boolean
}): string {
  const statusLabel = data.status === "pending" ? "Pending moderation" : "Published"
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Car Review Submitted</title></head>
<body style="font-family:system-ui,sans-serif;padding:24px;max-width:540px;margin:0 auto;background:#f8fafc;">
  <div style="background:#0f766e;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">New Car Review Submitted</h1>
    <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">GoGaddi — Customer Reviews</p>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
    <p style="margin:0 0 12px;color:#0f172a;font-size:14px;"><strong>Car Product ID:</strong> ${escapeHtml(data.productId)}</p>
    <p style="margin:0 0 12px;color:#0f172a;font-size:14px;"><strong>Reviewer:</strong> ${escapeHtml(data.reviewerName)}</p>
    <p style="margin:0 0 12px;color:#0f172a;font-size:14px;"><strong>Rating:</strong> ${"★".repeat(Math.max(1, Math.min(5, data.rating)))}</p>
    <p style="margin:0 0 12px;color:#0f172a;font-size:14px;"><strong>Status:</strong> ${escapeHtml(statusLabel)}</p>
    <div style="margin-top:8px;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
      <p style="margin:0;color:#334155;font-size:13px;white-space:pre-wrap;">${escapeHtml(data.reviewText || "(No review text)")}</p>
    </div>
    ${data.isFlagged ? `
    <div style="margin-top:14px;padding:12px;background:#fff7ed;border:1px solid #fdba74;border-radius:8px;">
      <p style="margin:0;color:#9a3412;font-size:13px;"><strong>Note:</strong> This review is flagged and currently hidden from storefront until admin action.</p>
    </div>` : ""}
  </div>
</body>
</html>
  `.trim()
}

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id: productId } = req.params
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)
  const reviews = await carsService.getCarReviews(productId)
  res.json({ reviews: (reviews as any[]).map(mapReview) })
}

/** Customer-facing: submit a review. In production consider auth (customer_id) and rate limiting. */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id: productId } = req.params
  const { reviewer_name, rating, review_text } = (req.body as any) ?? {}
  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)
  const review = await carsService.addReview(productId, {
    reviewer_name: reviewer_name ?? "Guest",
    rating: Math.min(5, Math.max(1, Number(rating) || 0)),
    review_text: review_text ?? "",
  })

  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.CHECKOUT_EMAIL_TO || process.env.ADMIN_EMAIL
  const from = process.env.RESEND_FROM || "GoGaddi <onboarding@resend.dev>"
  if (apiKey && adminEmail) {
    try {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from,
        to: adminEmail,
        subject: `New Car Review (${(review as any).status === "pending" ? "Needs Moderation" : "Published"})`,
        html: getReviewNotificationHtml({
          productId,
          reviewerName: (review as any).reviewer_name ?? "Guest",
          rating: Number((review as any).rating ?? 0),
          reviewText: (review as any).review_text ?? "",
          status: (review as any).status ?? "published",
          isFlagged: Boolean((review as any).is_flagged),
        }),
      })
    } catch (err) {
      console.error("[car-reviews] Failed to send admin notification:", err)
    }
  }

  res.status(201).json({ review: mapReview(review as any) })
}
