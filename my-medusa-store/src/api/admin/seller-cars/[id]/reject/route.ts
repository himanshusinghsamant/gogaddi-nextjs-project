import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { Resend } from "resend"
import { CARS_MODULE } from "../../../../../modules/cars"
import type CarsModuleService from "../../../../../modules/cars/services/car-service"

/**
 * POST /admin/seller-cars/:id/reject
 * Body: { reason?: string }
 * Rejects a seller car submission and optionally notifies the seller.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { id } = req.params
  const { reason } = (req.body as { reason?: string }) ?? {}

  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  const submission = await carsService.getSubmission(id)
  if (!submission) {
    res.status(404).json({ message: "Submission not found" })
    return
  }
  if (submission.status === "rejected") {
    res.status(400).json({ message: "This submission is already rejected" })
    return
  }

  await carsService.updateSubmissionStatus(id, "rejected", {
    rejection_reason: reason ?? "",
  })

  // ── Notify seller via email (non-blocking) ───────────────────────────
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "GoGaddi <onboarding@resend.dev>"

  if (apiKey) {
    try {
      const customerService = req.scope.resolve(Modules.CUSTOMER) as any
      const customer = await customerService.retrieveCustomer(submission.customer_id).catch(() => null)
      const sellerEmail = customer?.email
      if (sellerEmail) {
        const resend = new Resend(apiKey)
        await resend.emails.send({
          from,
          to: sellerEmail,
          subject: `Update on Your Car Listing — ${submission.title}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;padding:24px;max-width:520px;margin:0 auto;background:#f8fafc;">
  <div style="background:#dc2626;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">Listing Not Approved</h1>
    <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">GoGaddi Marketplace</p>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
    <p style="color:#0f172a;font-size:15px;">Unfortunately, your car listing <strong>${submission.title}</strong> was not approved at this time.</p>
    ${reason ? `<p style="color:#475569;font-size:14px;background:#fef2f2;padding:12px;border-radius:8px;border:1px solid #fecaca;"><strong>Reason:</strong> ${reason}</p>` : ""}
    <p style="color:#64748b;font-size:13px;margin-top:16px;">You are welcome to update your listing and resubmit. If you have questions, please contact our support team.</p>
  </div>
</body>
</html>
          `.trim(),
        })
      }
    } catch (err) {
      console.error("[reject] Failed to send seller notification:", err)
    }
  }

  res.json({
    message: "Submission rejected",
    submission_id: id,
    reason: reason ?? null,
  })
}
