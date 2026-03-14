import type { AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { MedusaResponse } from "@medusajs/framework/http"
import { Resend } from "resend"
import { CARS_MODULE } from "../../../../modules/cars"
import type CarsModuleService from "../../../../modules/cars/services/car-service"

function getAdminNotificationHtml(data: {
  title: string
  brand: string
  car_model: string
  year: string
  expected_price: number
  city: string
  customer_id: string
  submission_id: string
}): string {
  const priceInr = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(data.expected_price)

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Car Submission</title></head>
<body style="font-family:system-ui,sans-serif;padding:24px;max-width:520px;margin:0 auto;background:#f8fafc;">
  <div style="background:#1e40af;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">New Car Submission</h1>
    <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">GoGaddi Marketplace — Admin Review Required</p>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 0;color:#64748b;width:40%;">Car</td>
        <td style="padding:10px 0;font-weight:600;color:#0f172a;">${data.brand} ${data.car_model} ${data.year}</td>
      </tr>
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 0;color:#64748b;">Title</td>
        <td style="padding:10px 0;font-weight:600;color:#0f172a;">${data.title}</td>
      </tr>
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 0;color:#64748b;">Asking Price</td>
        <td style="padding:10px 0;font-weight:600;color:#0f172a;">${priceInr}</td>
      </tr>
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 0;color:#64748b;">City</td>
        <td style="padding:10px 0;color:#0f172a;">${data.city}</td>
      </tr>
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 0;color:#64748b;">Customer ID</td>
        <td style="padding:10px 0;color:#475569;font-size:12px;word-break:break-all;">${data.customer_id}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#64748b;">Submission ID</td>
        <td style="padding:10px 0;color:#475569;font-size:12px;word-break:break-all;">${data.submission_id}</td>
      </tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
      <p style="margin:0;font-size:13px;color:#166534;">
        <strong>Action needed:</strong> Log in to GoGaddi Admin to review and approve or reject this submission.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "You must be signed in to submit a car." })
    return
  }

  const body = (req.body as any) ?? {}
  const {
    title,
    brand,
    model,
    price,
    car_type,
    fuel_type,
    transmission,
    year,
    km_driven,
    color,
    engine,
    mileage,
    owner,
    city,
    description,
    images,
  } = body

  if (!title || String(title).trim() === "") {
    res.status(400).json({ message: "Title is required" })
    return
  }
  if (price == null || price === "" || Number(price) < 0) {
    res.status(400).json({ message: "A valid price is required" })
    return
  }

  const carsService = req.scope.resolve<CarsModuleService>(CARS_MODULE)

  let submission: any
  try {
    submission = await carsService.createSubmission({
      customer_id: customerId,
      title: String(title).trim(),
      brand: String(brand ?? "").trim(),
      car_model: String(model ?? "").trim(),
      car_type: String(car_type ?? "Used"),
      year: String(year ?? ""),
      fuel_type: String(fuel_type ?? ""),
      transmission: String(transmission ?? ""),
      km_driven: String(km_driven ?? ""),
      city: String(city ?? ""),
      color: String(color ?? ""),
      engine: String(engine ?? ""),
      mileage: String(mileage ?? ""),
      owner: String(owner ?? ""),
      description: String(description ?? "").trim(),
      images: Array.isArray(images) ? images : [],
      expected_price: Number(price) || 0,
    })
  } catch (err: any) {
    res.status(500).json({ message: err?.message ?? "Failed to save submission" })
    return
  }

  // Send admin notification email (non-blocking)
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.CHECKOUT_EMAIL_TO || process.env.ADMIN_EMAIL
  const from = process.env.RESEND_FROM || "GoGaddi <onboarding@resend.dev>"
  if (apiKey && adminEmail) {
    try {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from,
        to: adminEmail,
        subject: `New Car Submission: ${String(brand ?? "")} ${String(model ?? "")} — Review Needed`,
        html: getAdminNotificationHtml({
          title: String(title).trim(),
          brand: String(brand ?? ""),
          car_model: String(model ?? ""),
          year: String(year ?? ""),
          expected_price: Number(price) || 0,
          city: String(city ?? ""),
          customer_id: customerId,
          submission_id: submission.id,
        }),
      })
    } catch (err) {
      console.error("[sell-car] Failed to send admin notification:", err)
    }
  }

  res.status(201).json({
    submission_id: submission.id,
    status: "pending",
    message: "Your car has been submitted for review. We will notify you once it is approved.",
  })
}
