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

function pickAttr(item: any, key: string) {
  return item?.attributes?.[key] ?? item?.[key]
}

function normalize(item: any): NewsItem | null {
  const attrs = item?.attributes ?? item
  const id = item?.id ?? item?.documentId
  const title = attrs?.title
  const slug = attrs?.slug
  if (!id || !title || !slug) return null

  const media = attrs?.coverImage
  const mediaUrl = media?.data?.attributes?.url ?? media?.url

  return {
    id: String(id),
    title: String(title),
    slug: String(slug),
    excerpt: String(attrs?.excerpt ?? ""),
    description: String(attrs?.description ?? ""),
    image: toAbsoluteMediaUrl(mediaUrl),
    author: String(attrs?.author ?? "GoGaddi Editorial"),
    publishedAt: String(attrs?.publishedAt ?? ""),
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
