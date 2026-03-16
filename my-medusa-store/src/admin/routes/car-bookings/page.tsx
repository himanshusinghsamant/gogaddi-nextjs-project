import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CalendarMini } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Table,
  Text,
  toast,
} from "@medusajs/ui"
import { useState, useEffect, useCallback } from "react"

type Booking = {
  id: string
  car_id: string
  car_title: string | null
  name: string
  email: string
  phone: string
  city: string
  preferred_date: string
  preferred_time: string
  message: string | null
  status: string
  is_email_verified: boolean
  created_at: string
}

const STATUS_COLOR: Record<string, "green" | "red" | "orange" | "blue" | "grey"> = {
  pending: "orange",
  email_verified: "blue",
  confirmed: "green",
  cancelled: "red",
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  email_verified: "Email Verified",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
}

const CarBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("")
  const [actingId, setActingId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const url = filter ? `/admin/car-bookings?status=${filter}` : "/admin/car-bookings"
    fetch(url, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { bookings: [] }))
      .then((d) => setBookings(d.bookings ?? []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const confirm = async (id: string) => {
    setActingId(id)
    try {
      const res = await fetch(`/admin/car-bookings/${id}/confirm`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data?.message ?? "Failed to confirm booking")
        return
      }
      toast.success("Booking confirmed and customer notified.")
      load()
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to confirm booking")
    } finally {
      setActingId(null)
    }
  }

  const cancel = async (id: string) => {
    if (!window.confirm("Cancel this booking? The customer will be notified.")) return
    setActingId(id)
    try {
      const res = await fetch(`/admin/car-bookings/${id}/cancel`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data?.message ?? "Failed to cancel booking")
        return
      }
      toast.success("Booking cancelled and customer notified.")
      load()
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to cancel booking")
    } finally {
      setActingId(null)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level="h1">Test Drive Bookings</Heading>
          <div className="flex items-center gap-2">
            <Text size="small" className="text-ui-fg-subtle">
              Status:
            </Text>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-ui-border-base bg-ui-bg-field px-3 py-1.5 text-sm"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="email_verified">Email Verified</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button size="small" variant="secondary" onClick={load}>
              Refresh
            </Button>
          </div>
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          Customers who requested a free test drive. Confirm to notify them, or cancel to decline.
        </Text>
      </div>

      <div className="p-6">
        {loading ? (
          <Text size="small" className="text-ui-fg-subtle">Loading…</Text>
        ) : bookings.length === 0 ? (
          <Text size="small" className="text-ui-fg-subtle">No bookings found for this filter.</Text>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Customer</Table.HeaderCell>
                <Table.HeaderCell>Car</Table.HeaderCell>
                <Table.HeaderCell>Schedule</Table.HeaderCell>
                <Table.HeaderCell>City</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Created</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {bookings.map((b) => (
                <Table.Row key={b.id}>
                  <Table.Cell>
                    <div>
                      <Text size="small" weight="plus" className="block">{b.name}</Text>
                      <Text size="xsmall" className="text-ui-fg-subtle block">{b.email}</Text>
                      <Text size="xsmall" className="text-ui-fg-subtle">{b.phone}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Text size="small" weight="plus" className="block">
                        {b.car_title || "—"}
                      </Text>
                      <Text size="xsmall" className="text-ui-fg-subtle">{b.car_id}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small" className="block">{b.preferred_date}</Text>
                    <Text size="xsmall" className="text-ui-fg-subtle">{b.preferred_time}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{b.city}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-1">
                      <Badge size="small" color={STATUS_COLOR[b.status] ?? "grey"}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </Badge>
                      {!b.is_email_verified && (
                        <Text size="xsmall" className="text-ui-fg-subtle">Email not verified</Text>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="xsmall" className="text-ui-fg-subtle">
                      {new Date(b.created_at).toLocaleDateString("en-IN")}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {b.status === "confirmed" || b.status === "cancelled" ? (
                      <Text size="xsmall" className="text-ui-fg-subtle">—</Text>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          onClick={() => confirm(b.id)}
                          disabled={actingId !== null}
                        >
                          {actingId === b.id ? "Confirming…" : "Confirm"}
                        </Button>
                        <Button
                          size="small"
                          variant="danger"
                          onClick={() => cancel(b.id)}
                          disabled={actingId !== null}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Test Drive Bookings",
  icon: CalendarMini,
})

export default CarBookingsPage
