"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { requestResetPassword } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

async function submitForgot(
  _prev: { done?: boolean; error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim()
  const res = await requestResetPassword(email)
  if (!res.success) return { done: false, error: res.error ?? "Failed to request reset." }
  return { done: true }
}

export default function ForgotPassword({ setCurrentView }: Props) {
  const [state, formAction] = useActionState(submitForgot, null)

  if (state?.done) {
    return (
      <div className="text-center py-6" data-testid="forgot-password-success">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 text-2xl">
          ✓
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Check your email</h2>
        <p className="text-slate-600 text-sm mb-6">
          If an account exists for that email, you&apos;ll receive a reset link shortly.
        </p>
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="w-full" data-testid="forgot-password-form">
      <h2 className="text-lg font-bold text-slate-900 mb-2">Reset password</h2>
      <p className="text-slate-500 text-sm mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form className="w-full space-y-4" action={formAction}>
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          data-testid="forgot-email-input"
        />
        <ErrorMessage error={state?.error} data-testid="forgot-error-message" />
        <SubmitButton className="w-full" data-testid="forgot-submit-button">
          Send reset link
        </SubmitButton>
      </form>
      <button
        type="button"
        onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
        className="block w-full text-center text-sm text-blue-600 hover:underline mt-4"
        data-testid="forgot-back-button"
      >
        ← Back to sign in
      </button>
    </div>
  )
}
