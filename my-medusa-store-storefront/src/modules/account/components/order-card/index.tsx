import { Button } from "@medusajs/ui"
import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OrderCancelButton from "@modules/account/components/order-cancel-button"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { ChevronRight } from "lucide-react"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(
    () => order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    [order]
  )
  const numberOfProducts = order.items?.length ?? 0
  const isCanceled = (order as { status?: string }).status?.toLowerCase() === "canceled"

  return (
    <div
      className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50"
      data-testid="order-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900" data-testid="order-display-id">
            #{order.display_id}
          </span>
          {isCanceled && (
            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-medium">
              Cancelled
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span data-testid="order-created-at">
            {new Date(order.created_at).toDateString()}
          </span>
          <span className="font-semibold text-slate-900" data-testid="order-amount">
            {convertToLocale({ amount: order.total, currency_code: order.currency_code })}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {order.items?.slice(0, 3).map((i) => (
          <div key={i.id} className="flex flex-col gap-1" data-testid="order-item">
            <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" fit="contain" />
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <span className="font-medium text-slate-900 truncate" data-testid="item-title">
                {i.title}
              </span>
              <span>×</span>
              <span data-testid="item-quantity">{i.quantity}</span>
            </div>
          </div>
        ))}
        {numberOfProducts > 3 && (
          <div className="flex flex-col items-center justify-center text-sm text-slate-500">
            +{numberOfLines - (order.items?.slice(0, 3).reduce((a, i) => a + i.quantity, 0) ?? 0)} more
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200">
        {!isCanceled && (
          <OrderCancelButton
            orderId={order.id}
            disabled={isCanceled}
            variant="transparent"
          />
        )}
        <LocalizedClientLink href={`/account/orders/details/${order.id}`} className="ml-auto">
          <Button data-testid="order-details-link" variant="secondary" className="rounded-xl">
            See details <ChevronRight size={16} className="inline ml-0.5" />
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
