import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Switch, Text } from "@medusajs/ui"
import { useState } from "react"

const AvailabilityToggle = (props: any) => {
  const product = props?.data?.product ?? props?.data
  const productId = product?.id
  const existingMeta = (product?.metadata ?? {}) as Record<string, unknown>

  const initial = Boolean(existingMeta.available)
  const [value, setValue] = useState<boolean>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!productId) {
    return null
  }

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/admin/products/${productId}/metadata`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: {
            ...existingMeta,
            available: value,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message ?? "Failed to update availability")
      }

      setMessage("Availability updated.")
    } catch (e: any) {
      setMessage(e?.message ?? "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="mt-4 flex items-center justify-between gap-4 p-4">
      <div>
        <Heading level="h3">Availability</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Toggle whether this car is currently available for purchase or booking.
        </Text>
        {message && (
          <Text size="small" className="mt-1 text-ui-fg-subtle">
            {message}
          </Text>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={value} onCheckedChange={(v: boolean) => setValue(v)} />
        <Text size="small">{value ? "Available" : "Not available"}</Text>
        <Button size="small" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default AvailabilityToggle

