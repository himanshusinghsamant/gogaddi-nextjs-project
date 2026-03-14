import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string }
    const email = (body?.email ?? "").trim().toLowerCase()

    if (!email) {
      return NextResponse.json(
        { message: "Please enter your email address." },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = (
      process.env.CHECKOUT_EMAIL_TO ||
      process.env.CONTACT_EMAIL_TO ||
      process.env.ADMIN_EMAIL ||
      ""
    ).trim()

    if (apiKey && to) {
      const from = (
        process.env.RESEND_FROM ||
        process.env.CHECKOUT_EMAIL_FROM ||
        "GoGaddi <onboarding@resend.dev>"
      ).trim()
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from,
        to: [to],
        subject: `Newsletter signup: ${email}`,
        html: `
          <p><strong>New newsletter subscription</strong></p>
          <p>Email: ${email}</p>
          <p>Date: ${new Date().toISOString()}</p>
        `,
      })
    }

    return NextResponse.json({ ok: true, message: "Thanks for subscribing!" })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Subscription failed. Please try again."
    return NextResponse.json({ message }, { status: 500 })
  }
}
