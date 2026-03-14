"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OrderCancelButton from "@modules/account/components/order-cancel-button"
import OrderUpdateAddressForm from "@modules/account/components/order-update-address-form"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const isCanceled =
    (order as { status?: string }).status?.toLowerCase() === "canceled"

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6" data-testid="order-details-container">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Order #{order.display_id}</h1>
        <div className="flex items-center gap-2">
          {isCanceled && (
            <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-sm font-medium">
              Cancelled
            </span>
          )}
          <OrderCancelButton
            orderId={order.id}
            disabled={isCanceled}
            variant="secondary"
          />
          <LocalizedClientLink
            href="/account/orders"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            data-testid="back-to-overview-button"
          >
            <XMark /> Back to orders
          </LocalizedClientLink>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderUpdateAddressForm
          orderId={order.id}
          order={order}
          disabled={isCanceled}
        />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}


export default OrderDetailsTemplate
