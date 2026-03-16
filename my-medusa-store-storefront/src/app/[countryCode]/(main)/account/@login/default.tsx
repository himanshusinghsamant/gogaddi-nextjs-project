import LoginTemplate from "@modules/account/templates/login-template"

/**
 * Renders for account sub-routes (e.g. /account/my-cars) when the login slot
 * is active, so Next.js parallel routes resolve and the page doesn't 404.
 */
export default function LoginDefault() {
  return <LoginTemplate />
}
