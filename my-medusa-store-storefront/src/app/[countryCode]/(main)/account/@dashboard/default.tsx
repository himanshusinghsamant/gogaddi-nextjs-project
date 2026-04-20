import { redirect } from "next/navigation"

/**
 * Fallback for the dashboard slot when segment doesn't match; redirect to account overview.
 */
export default async function DashboardDefault(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  redirect(`/${countryCode}/account`)
}
