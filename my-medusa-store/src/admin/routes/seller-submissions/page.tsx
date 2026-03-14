import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Table,
  Text,
  Textarea,
  Label,
  toast,
} from "@medusajs/ui"
import { useState, useEffect, useCallback } from "react"

type Submission = {
  id: string
  customer_id: string
  title: string
  brand: string
  car_model: string
  year: string
  fuel_type: string
  transmission: string
  km_driven: string
  city: string
  expected_price: number
  status: string
  product_id: string | null
  rejection_reason: string | null
  images: string[]
  description: string
  created_at: string
}

const STATUS_COLOR: Record<string, "green" | "red" | "orange" | "blue"> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
  sold: "blue",
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

const SellerSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("pending")
  const [actingId, setActingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const url = filter ? `/admin/seller-cars?status=${filter}` : "/admin/seller-cars"
    fetch(url, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { submissions: [] }))
      .then((d) => setSubmissions(d.submissions ?? []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const approve = async (id: string) => {
    setActingId(id)
    try {
      const res = await fetch(`/admin/seller-cars/${id}/approve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data?.message ?? "Approve failed")
        return
      }
      toast.success("Approved. Product created and listing is live.")
      // Remove approved row from list immediately so UI updates (pending filter won't show it after refetch)
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
      load()
    } catch (e: any) {
      toast.error(e?.message ?? "Approve failed")
    } finally {
      setActingId(null)
    }
  }

  const reject = async (id: string) => {
    if (!rejectReason.trim() && !window.confirm("Reject without a reason?")) return
    setActingId(id)
    try {
      const res = await fetch(`/admin/seller-cars/${id}/reject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() || undefined }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data?.message ?? "Reject failed")
        return
      }
      toast.success("Submission rejected. Seller will be notified.")
      setRejectingId(null)
      setRejectReason("")
      load()
    } catch (e: any) {
      toast.error(e?.message ?? "Reject failed")
    } finally {
      setActingId(null)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level="h1">Seller Car Submissions</Heading>
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          Cars submitted by sellers appear here. Approve to create a Medusa product and publish to
          the marketplace. Reject to decline with an optional reason (seller is notified by email).
        </Text>
      </div>

      <div className="p-6">
        {loading ? (
          <Text size="small" className="text-ui-fg-subtle">
            Loading…
          </Text>
        ) : submissions.length === 0 ? (
          <Text size="small" className="text-ui-fg-subtle">
            No submissions found for this filter.
          </Text>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Car</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Location</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Submitted</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {submissions.map((s) => (
                <Table.Row key={s.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      {s.images?.[0] && (
                        <img
                          src={s.images[0]}
                          alt=""
                          className="h-12 w-16 rounded object-cover bg-ui-bg-subtle"
                        />
                      )}
                      <div>
                        <Text size="small" weight="plus" className="block">
                          {s.title}
                        </Text>
                        <Text size="xsmall" className="text-ui-fg-subtle">
                          {s.brand} · {s.car_model} · {s.year} · {s.fuel_type} / {s.transmission}
                        </Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{formatINR(s.expected_price)}</Table.Cell>
                  <Table.Cell>{s.city || "—"}</Table.Cell>
                  <Table.Cell>
                    <Badge size="small" color={STATUS_COLOR[s.status] ?? "grey"}>
                      {s.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="xsmall" className="text-ui-fg-subtle">
                      {new Date(s.created_at).toLocaleDateString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {rejectingId === s.id ? (
                      <div className="flex flex-col gap-2 max-w-xs">
                        <Label size="small">Rejection reason (optional)</Label>
                        <Textarea
                          placeholder="e.g. Image quality too low"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={2}
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                              setRejectingId(null)
                              setRejectReason("")
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="danger"
                            onClick={() => reject(s.id)}
                            disabled={actingId !== null}
                          >
                            {actingId === s.id ? "Rejecting…" : "Reject"}
                          </Button>
                        </div>
                      </div>
                    ) : s.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          onClick={() => approve(s.id)}
                          disabled={actingId !== null}
                        >
                          {actingId === s.id ? "Approving…" : "Approve"}
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => setRejectingId(s.id)}
                          disabled={actingId !== null}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : s.status === "rejected" && s.rejection_reason ? (
                      <Text size="xsmall" className="text-ui-fg-subtle max-w-[160px]">
                        Reason: {s.rejection_reason}
                      </Text>
                    ) : (
                      "—"
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
  label: "Seller Submissions",
  icon: DocumentText,
})

export default SellerSubmissionsPage
