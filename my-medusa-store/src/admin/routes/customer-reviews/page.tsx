import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Table,
  Text,
  toast,
} from "@medusajs/ui"
import { useCallback, useEffect, useState } from "react"

type Review = {
  id: string
  product_id: string
  reviewer_name: string
  rating: number
  review_text: string
  status: "published" | "pending" | string
  is_flagged: boolean
  flagged_words?: string | null
  created_at: string
}

const CustomerReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("")
  const [actingId, setActingId] = useState<string | null>(null)

  const loadReviews = useCallback(() => {
    setLoading(true)
    const query = filter ? `?flagged=${filter}` : ""
    fetch(`/admin/car-reviews${query}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { reviews: [] }))
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const deleteReview = async (id: string) => {
    if (!window.confirm("Delete this review?")) return
    setActingId(id)
    try {
      const res = await fetch(`/admin/car-reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data?.message ?? "Failed to delete review")
        return
      }
      toast.success("Review deleted")
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete review")
    } finally {
      setActingId(null)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level="h1">Customer Reviews</Heading>
          <div className="flex items-center gap-2">
            <Text size="small" className="text-ui-fg-subtle">
              Flagged:
            </Text>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-ui-border-base bg-ui-bg-field px-3 py-1.5 text-sm"
            >
              <option value="">All</option>
              <option value="true">Flagged</option>
              <option value="false">Not flagged</option>
            </select>
            <Button size="small" variant="secondary" onClick={loadReviews}>
              Refresh
            </Button>
          </div>
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          Manage customer-submitted car reviews. Flagged reviews are hidden from storefront and should be moderated.
        </Text>
      </div>

      <div className="p-6">
        {loading ? (
          <Text size="small" className="text-ui-fg-subtle">
            Loading...
          </Text>
        ) : reviews.length === 0 ? (
          <Text size="small" className="text-ui-fg-subtle">
            No reviews found for this filter.
          </Text>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Reviewer</Table.HeaderCell>
                <Table.HeaderCell>Car ID</Table.HeaderCell>
                <Table.HeaderCell>Rating</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Review</Table.HeaderCell>
                <Table.HeaderCell>Created</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {reviews.map((r) => (
                <Table.Row key={r.id}>
                  <Table.Cell>{r.reviewer_name || "Guest"}</Table.Cell>
                  <Table.Cell>
                    <Text size="xsmall" className="text-ui-fg-subtle">
                      {r.product_id}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{Math.max(1, Math.min(5, Number(r.rating) || 0))} / 5</Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-1">
                      <Badge size="small" color={r.status === "published" ? "green" : "orange"}>
                        {r.status}
                      </Badge>
                      {r.is_flagged && (
                        <Text size="xsmall" className="text-ui-tag-orange-text">
                          Flagged: {r.flagged_words || "bad language detected"}
                        </Text>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small" className="max-w-[420px] whitespace-pre-wrap break-words">
                      {r.review_text || "-"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="xsmall" className="text-ui-fg-subtle">
                      {new Date(r.created_at).toLocaleDateString("en-IN")}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => deleteReview(r.id)}
                      disabled={actingId !== null}
                    >
                      {actingId === r.id ? "Deleting..." : "Delete"}
                    </Button>
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
  label: "Customer Reviews",
  icon: DocumentText,
})

export default CustomerReviewsPage
