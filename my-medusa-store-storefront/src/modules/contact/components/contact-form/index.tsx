"use client"

import { useState } from "react"
import TextField from "@modules/common/components/text-field"
import Button from "@modules/common/components/button"

export default function ContactForm() {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [enquiry, setEnquiry] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          enquiry: enquiry.trim(),
          phone: phone.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus("error")
        setErrorMessage(data?.message || "Something went wrong. Please try again.")
        return
      }

      setStatus("success")
      setFirstName("")
      setEmail("")
      setPhone("")
      setEnquiry("")
    } catch {
      setStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    }
  }

  const inputClass = "rounded-2xl border-slate-200 bg-slate-50/50"
  const labelClass = "text-[10px] font-semibold uppercase tracking-widest text-slate-500"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          label="First Name"
          id="first-name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          containerClassName={inputClass}
        />
        <TextField
          label="E-Mail Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          containerClassName={inputClass}
        />
      </div>

      <TextField
        label="Phone (optional)"
        id="phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        containerClassName={inputClass}
      />

      <div>
        <label htmlFor="enquiry" className={`block mb-1.5 ${labelClass}`}>
          Enquiry
        </label>
        <textarea
          id="enquiry"
          rows={4}
          value={enquiry}
          onChange={(e) => setEnquiry(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-y min-h-[120px]"
          placeholder="Your message..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm font-medium">
          {errorMessage}
        </p>
      )}

      {status === "success" && (
        <p className="text-green-600 text-sm font-medium">
          Thank you! Your message has been sent. We will get back to you soon.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="min-w-[140px]"
      >
        {status === "loading" ? "Sending…" : "Submit"}
      </Button>
    </form>
  )
}
