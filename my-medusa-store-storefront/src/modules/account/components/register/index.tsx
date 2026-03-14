"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="w-full" data-testid="register-page">
      <form className="w-full space-y-4" action={formAction}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
        </div>
        <Input
          label="Email"
          name="email"
          required
          type="email"
          autoComplete="email"
          data-testid="email-input"
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          data-testid="phone-input"
        />
        <Input
          label="Password"
          name="password"
          required
          type="password"
          autoComplete="new-password"
          data-testid="password-input"
        />
        <ErrorMessage error={message} data-testid="register-error" />
        <p className="text-xs text-slate-500">
          By creating an account, you agree to GoGaddi&apos;s{" "}
          <LocalizedClientLink href="/privacy-policy" className="underline hover:text-slate-700">
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink href="/terms" className="underline hover:text-slate-700">
            Terms of Use
          </LocalizedClientLink>.
        </p>
        <SubmitButton className="w-full !mt-4" data-testid="register-button">
          Create account
        </SubmitButton>
      </form>
      <p className="text-center text-slate-500 text-sm mt-6">
        Already a member?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register
