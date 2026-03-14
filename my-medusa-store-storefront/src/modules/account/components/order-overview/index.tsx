"use client"

import { Button } from "@medusajs/ui"
import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Package } from "lucide-react"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-6 w-full">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="py-12 px-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center"
      data-testid="no-orders-container"
    >
      <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mx-auto mb-4">
        <Package size={28} />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h2>
      <p className="text-slate-500 text-sm mb-6">
        When you place an order, it will show up here.
      </p>
      <LocalizedClientLink href="/cars">
        <Button data-testid="continue-shopping-button" className="rounded-xl">
          Browse cars
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
