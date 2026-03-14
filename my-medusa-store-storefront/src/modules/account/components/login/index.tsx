import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="w-full" data-testid="login-page">
      <form className="w-full space-y-4" action={formAction}>
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          required
          data-testid="email-input"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          data-testid="password-input"
        />
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full !mt-6">
          Sign in
        </SubmitButton>
      </form>
      <button
        type="button"
        onClick={() => setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)}
        className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 hover:underline mt-4"
        data-testid="forgot-password-button"
      >
        Forgot password?
      </button>
      <p className="text-center text-slate-500 text-sm mt-6">
        Not a member?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-medium text-blue-600 hover:underline"
          data-testid="register-button"
        >
          Join us
        </button>
      </p>
    </div>
  )
}

export default Login
