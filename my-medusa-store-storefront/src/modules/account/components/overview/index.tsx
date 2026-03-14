import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Car, MapPin, User, ChevronRight } from "lucide-react"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)
  const addressCount = customer?.addresses?.length ?? 0
  const recentOrders = (orders ?? []).slice(0, 5)

  return (
    <div className="p-6 md:p-8" data-testid="overview-page-wrapper">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900" data-testid="welcome-message">
          Hello, {customer?.first_name ?? "there"}
        </h1>
        <p className="text-slate-500 text-sm mt-1" data-testid="customer-email" data-value={customer?.email}>
          {customer?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <LocalizedClientLink
          href="/account/profile"
          className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200">
            <User size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900" data-testid="customer-profile-completion" data-value={profileCompletion}>
              {profileCompletion}%
            </p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Profile</p>
          </div>
          <ChevronRight size={18} className="ml-auto text-slate-400 group-hover:text-blue-600" />
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/account/addresses"
          className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900" data-testid="addresses-count" data-value={addressCount}>
              {addressCount}
            </p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Addresses</p>
          </div>
          <ChevronRight size={18} className="ml-auto text-slate-400 group-hover:text-blue-600" />
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/account/my-cars"
          className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors group col-span-2 md:col-span-1"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200">
            <Car size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">My Listings</p>
            <p className="text-xs font-medium text-slate-500">Manage your cars</p>
          </div>
          <ChevronRight size={18} className="ml-auto text-slate-400 group-hover:text-blue-600" />
        </LocalizedClientLink>
      </div>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent orders</h2>
          <LocalizedClientLink
            href="/account/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View all
          </LocalizedClientLink>
        </div>
        <ul className="space-y-3" data-testid="orders-wrapper">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                <LocalizedClientLink
                  href={`/account/orders/details/${order.id}`}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 min-w-0">
                    <span className="font-semibold text-slate-900" data-testid="order-id" data-value={order.display_id}>
                      #{order.display_id}
                    </span>
                    <span className="text-sm text-slate-500" data-testid="order-created-date">
                      {new Date(order.created_at).toDateString()}
                    </span>
                    <span className="text-sm font-medium text-slate-700" data-testid="order-amount">
                      {convertToLocale({ amount: order.total, currency_code: order.currency_code })}
                    </span>
                  </div>
                  <span className="sr-only">Go to order #{order.display_id}</span>
                  <ChevronRight size={20} className="shrink-0 text-slate-400 group-hover:text-blue-600" />
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <p className="text-slate-500 font-medium" data-testid="no-orders-message">
                No recent orders
              </p>
              <LocalizedClientLink
                href="/cars"
                className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Browse cars →
              </LocalizedClientLink>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}

function getProfileCompletion(customer: HttpTypes.StoreCustomer | null): number {
  if (!customer) return 0
  let count = 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  if (customer.addresses?.find((a) => a.is_default_billing)) count++
  return Math.round((count / 4) * 100)
}

export default Overview
