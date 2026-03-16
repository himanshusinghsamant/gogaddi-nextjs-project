"use client"

import { useState } from "react"

export type TestDriveBookingProps = {
  carId: string
  carName: string
}

type FormState = {
  name: string
  email: string
  phone: string
  city: string
  preferred_date: string
  preferred_time: string
  message: string
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  preferred_date: "",
  preferred_time: "",
  message: "",
}

export default function TestDriveBookingModal({ carId, carName }: TestDriveBookingProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() ||
        !form.city.trim() || !form.preferred_date || !form.preferred_time) {
      setError("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/car-bookings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_id: carId,
          car_title: carName,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          preferred_date: form.preferred_date,
          preferred_time: form.preferred_time,
          message: form.message.trim() || undefined,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 401) {
        setError("Please log in to book a test drive.")
        return
      }
      if (!res.ok) {
        setError(data?.message || "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
      setForm(INITIAL_FORM)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function closeModal() {
    setOpen(false)
    setTimeout(() => {
      setSubmitted(false)
      setError(null)
    }, 300)
  }

  // Minimum date = today
  const today = new Date().toISOString().split("T")[0]

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
      >
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Book Free Test Drive
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/40 backdrop-blur-md"
          onClick={closeModal}
        >
          {/* Modal panel */}
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mt-16 md:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Book Free Test Drive</h2>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{carName}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Received!</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                    We've sent a verification link to your email.
                    Please check your inbox and click the link to confirm your test drive booking.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Rahul Sharma"
                        required
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Email Address" required>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="rahul@example.com"
                        required
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Phone Number" required>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        required
                        className={inputCls}
                      />
                    </Field>

                    <Field label="City" required>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        required
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Preferred Date" required>
                      <input
                        type="date"
                        name="preferred_date"
                        value={form.preferred_date}
                        onChange={handleChange}
                        min={today}
                        required
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Preferred Time" required>
                      <input
                        type="time"
                        name="preferred_time"
                        value={form.preferred_time}
                        onChange={handleChange}
                        required
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Message (optional)">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Any specific questions or requests?"
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    {submitting ? "Submitting…" : "Submit Booking Request"}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    A verification link will be sent to your email to confirm the booking.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function TestDriveBookingPageForm({ carId, carName }: TestDriveBookingProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.city.trim() ||
      !form.preferred_date ||
      !form.preferred_time
    ) {
      setError("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/car-bookings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_id: carId,
          car_title: carName,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          preferred_date: form.preferred_date,
          preferred_time: form.preferred_time,
          message: form.message.trim() || undefined,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 401) {
        setError("Please log in to book a test drive.")
        return
      }
      if (!res.ok) {
        setError((data as any)?.message || "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
      setForm(INITIAL_FORM)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Header */}
      <div className="relative px-8 py-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Free Test Drive
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            Experience the {carName}
          </h1>
          <p className="text-blue-100/80 text-sm font-medium max-w-md">
            Book a verified test drive at your doorstep. No hidden charges.
          </p>
        </div>
      </div>

      <div className="px-8 py-8">
        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-sm">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              We've sent a verification link to <span className="font-semibold text-gray-900">{form.email}</span>. 
              Please verify to lock your slot.
            </p>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 font-medium">
              Check your spam folder if you don't see the email within 2 minutes.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Full Name" required>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Email Address" required>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@example.com"
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Phone Number" required>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="City" required>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Preferred Date" required>
                <input
                  type="date"
                  name="preferred_date"
                  value={form.preferred_date}
                  onChange={handleChange}
                  min={today}
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Preferred Time" required>
                <input
                  type="time"
                  name="preferred_time"
                  value={form.preferred_time}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Message (Optional)">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Any specific requests or questions?"
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide uppercase"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing Request...
                </span>
              ) : (
                "Confirm Booking Request"
              )}
            </button>

            <p className="text-[10px] text-gray-400 text-center font-medium uppercase tracking-wider">
              Secure Booking • Verification Required
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
