import "server-only"

export type NewsItem = {
  id: string
  title: string
  slug: string
  excerpt: string
  description: string
  image: string | null
  author: string
  publishedAt: string
  category: string
  isFeatured: boolean
}

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ""

function toAbsoluteMediaUrl(url?: string): string | null {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  if (!STRAPI_BASE_URL) return null
  return `${STRAPI_BASE_URL.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Strapi Blocks / nested rich text → safe HTML for article body. */
function strapiRichNodeToHtml(node: any): string {
  if (node == null) return ""
  if (typeof node === "string") return escapeHtml(node)
  if (Array.isArray(node)) return node.map(strapiRichNodeToHtml).join("")

  const type = node.type ?? node.__component
  const children = node.children ?? node.content
  const inner = Array.isArray(children) ? children.map(strapiRichNodeToHtml).join("") : ""

  switch (type) {
    case "paragraph":
      return `<p>${inner || "<br />"}</p>`
    case "heading": {
      const level = Math.min(6, Math.max(1, Number(node.level) || 2))
      return `<h${level}>${inner}</h${level}>`
    }
    case "text":
      return escapeHtml(String(node.text ?? ""))
    case "link": {
      const href = escapeHtml(String(node.url ?? "#"))
      return `<a href="${href}" rel="noopener noreferrer" class="text-blue-600 underline">${inner}</a>`
    }
    case "list":
      return node.format === "ordered" ? `<ol>${inner}</ol>` : `<ul>${inner}</ul>`
    case "list-item":
      return `<li>${inner}</li>`
    case "quote":
      return `<blockquote class="border-l-4 border-slate-300 pl-4 italic text-slate-700">${inner}</blockquote>`
    case "code":
      return `<pre class="overflow-x-auto rounded-lg bg-slate-900 text-slate-100 p-4 text-sm"><code>${inner}</code></pre>`
    case "doc":
    case "root":
      return inner
    default:
      return inner
  }
}

/**
 * Normalize Strapi description: HTML string, plain text, or Blocks JSON → HTML for `dangerouslySetInnerHTML`.
 */
export function richTextToArticleHtml(raw: unknown): string {
  if (raw == null || raw === "") return ""
  if (typeof raw === "string") {
    const s = raw.trim()
    if (!s) return ""
    if (/<[a-z][\s\S]*>/i.test(s)) return s
    return s
      .split(/\n\n+/)
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br />")}</p>`)
      .join("")
  }
  if (Array.isArray(raw)) {
    return raw.map(strapiRichNodeToHtml).join("")
  }
  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>
    if (Array.isArray(o.content)) return strapiRichNodeToHtml({ type: "doc", content: o.content })
    if (o.data && typeof o.data === "object") return richTextToArticleHtml(o.data)
    if (Array.isArray(o.blocks)) return richTextToArticleHtml(o.blocks)
  }
  return ""
}

function normalize(item: any): NewsItem | null {
  const attrs = item?.attributes ?? item
  const id = item?.id ?? item?.documentId
  const title = attrs?.title
  const slug = attrs?.slug
  if (!id || !title || !slug) return null

  const media = attrs?.coverImage
  const mediaUrl =
    media?.data?.attributes?.url ??
    media?.data?.url ??
    media?.attributes?.url ??
    media?.url

  const rawDescription = attrs?.description ?? attrs?.body ?? attrs?.content

  return {
    id: String(id),
    title: String(title),
    slug: String(slug),
    excerpt: String(attrs?.excerpt ?? "").trim(),
    description: richTextToArticleHtml(rawDescription),
    image: toAbsoluteMediaUrl(mediaUrl),
    author: String(attrs?.author ?? "GoGaddi Editorial"),
    publishedAt: String(attrs?.publishedAt ?? attrs?.createdAt ?? ""),
    category: String(attrs?.category ?? "News"),
    isFeatured: Boolean(attrs?.isFeatured),
  }
}

async function fetchStrapi(path: string): Promise<any | null> {
  if (!STRAPI_BASE_URL) return null
  try {
    const res = await fetch(`${STRAPI_BASE_URL.replace(/\/$/, "")}${path}`, {
      method: "GET",
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const safeSlug = encodeURIComponent(slug)
  const data = await fetchStrapi(
    `/api/news-items?populate=*&filters[slug][$eq]=${safeSlug}&pagination[limit]=1`
  )
  const list = Array.isArray(data?.data) ? data.data : []
  return normalize(list[0])
}
