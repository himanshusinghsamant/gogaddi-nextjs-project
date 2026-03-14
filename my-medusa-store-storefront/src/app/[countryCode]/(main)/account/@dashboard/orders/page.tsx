import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="p-6 md:p-8 w-full" data-testid="orders-page-wrapper">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 text-sm mt-1">
          View order status, cancel or update shipping address.
        </p>
      </div>
      <OrderOverview orders={orders} />
      <hr className="my-10 border-slate-200" />
      <TransferRequestForm />
    </div>
  )
}
