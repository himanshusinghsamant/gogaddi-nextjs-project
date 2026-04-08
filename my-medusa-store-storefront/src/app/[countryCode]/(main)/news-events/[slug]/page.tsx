import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getNewsBySlug } from "@lib/api/news"
import { PLACEHOLDER_IMAGE_URL } from "@lib/constants/placeholder-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value || "—"
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsBySlug(slug)
  if (!news) {
    return {
      title: "News & Events | GoGaddi",
      description: "Automotive news and events from GoGaddi.",
    }
  }
  return {
    title: news.title,
    description: news.excerpt || "Automotive news and events from GoGaddi.",
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)
  if (!news) notFound()

  return (
    <div className="bg-slate-50 min-h-screen">
      <article className="content-container py-10 md:py-14">
        <div className="mb-6">
          <LocalizedClientLink
            href="/news-events"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Back to News
          </LocalizedClientLink>
        </div>
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
            {news.category || "News"}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
            {news.title}
          </h1>
          <p className="text-sm text-slate-500">
            By {news.author || "GoGaddi Editorial"} · {formatDate(news.publishedAt)}
          </p>
        </header>

        <div className="relative w-full aspect-[16/8] rounded-3xl overflow-hidden mb-8 bg-slate-200">
          <Image
            src={news.image ?? PLACEHOLDER_IMAGE_URL}
            alt={news.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
        </div>

        <div
          className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight"
          dangerouslySetInnerHTML={{ __html: news.description || news.excerpt }}
        />
      </article>
    </div>
  )
}
