import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, Sparkles, User } from "lucide-react"
import { getNewsBySlug, richTextToArticleHtml } from "@lib/api/news"
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

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

/** Show lead excerpt only when the body does not already start with the same text. */
function shouldShowSummaryApartFromBody(excerpt: string, bodyHtml: string): boolean {
  const ex = excerpt.replace(/\s+/g, " ").trim()
  if (!ex) return false
  const body = bodyHtml.trim()
  if (!body) return false
  const plain = stripHtmlTags(body).replace(/\s+/g, " ").trim()
  if (!plain) return true
  return !plain.startsWith(ex)
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
  const fromBody = stripHtmlTags(news.description).replace(/\s+/g, " ").trim()
  const metaDesc =
    news.excerpt.trim() ||
    (fromBody.length > 160 ? `${fromBody.slice(0, 157)}…` : fromBody) ||
    "Automotive news and events from GoGaddi."
  return {
    title: news.title,
    description: metaDesc,
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)
  if (!news) notFound()

  const bodyHtml = news.description.trim()
  const excerptPlain = news.excerpt.trim()
  const showLeadSummary = shouldShowSummaryApartFromBody(excerptPlain, bodyHtml)
  const mainArticleHtml =
    bodyHtml || (excerptPlain ? richTextToArticleHtml(excerptPlain) : "")

  return (
    <div className="bg-slate-50 min-h-screen">
      <article className="content-container py-10 md:py-14 max-w-7xl mx-auto">
        <div className="mb-6">
          <LocalizedClientLink
            href="/news-events"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Back to News
          </LocalizedClientLink>
        </div>
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              {news.category || "News"}
            </p>
            {news.isFeatured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900">
                <Sparkles className="h-3 w-3" aria-hidden />
                Featured
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            {news.title}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <time dateTime={news.publishedAt || undefined}>{formatDate(news.publishedAt)}</time>
            </span>
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <span>{news.author || "GoGaddi Editorial"}</span>
            </span>
          </div>
        </header>

        <div className="relative w-full aspect-[16/8] rounded-3xl overflow-hidden mb-8 bg-slate-200">
          <Image
            src={news.image ?? PLACEHOLDER_IMAGE_URL}
            alt={news.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        {showLeadSummary ? (
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium border-l-4 border-blue-500 pl-5 py-1 mb-8">
            {excerptPlain}
          </p>
        ) : null}

        {mainArticleHtml ? (
          <div
            className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: mainArticleHtml }}
          />
        ) : (
          <p className="text-slate-500 italic">More details for this story will be available soon.</p>
        )}
      </article>
    </div>
  )
}
