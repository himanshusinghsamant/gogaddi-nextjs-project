import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

/** Same shape as `CarFilterOptions` in `./cars` — kept local to avoid importing `cars` (circular graph with Turbopack). */
type CarFilterOptionsSnapshot = {
  brands: string[]
  fuelTypes: string[]
  transmissions: string[]
  cities: string[]
  years: string[]
  owners: string[]
  models: string[]
}

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

/** Root-level categories for sitemap (no parent), with children. */
export const getRootCategoriesForSitemap = async () => {
  const all = await listCategories({ limit: 500 })
  if (!all?.length) return []
  const roots = all.filter(
    (c: any) => !c.parent_category_id && !c.parent_category
  )
  return roots
}

/**
 * Brand labels for filters: only real “brand” category names, not model/variant subcategories.
 * - If a root is a generic bucket (e.g. “Car”), use its **direct children** as brands.
 * - If a root is a brand (e.g. “Honda”) with model children, use **only the root** name (ignore children = models).
 * - Leaf roots (no children) use the root name.
 */
const GENERIC_BRAND_PARENT_NAMES = new Set([
  "car",
  "cars",
  "vehicle",
  "vehicles",
  "browse",
  "shop",
  "all",
  "inventory",
  "new cars",
  "used cars",
])

export function getBrandNamesFromCategoryTree(
  roots: HttpTypes.StoreProductCategory[] | any[] | null | undefined
): string[] {
  if (!roots?.length) return []
  const out = new Set<string>()
  for (const root of roots) {
    const name = String((root as any)?.name ?? "").trim()
    const children = ((root as any)?.category_children ?? []) as any[]
    const isGeneric = GENERIC_BRAND_PARENT_NAMES.has(name.toLowerCase())

    if (children.length > 0) {
      if (isGeneric) {
        for (const ch of children) {
          const cn = String(ch?.name ?? "").trim()
          if (cn) out.add(cn)
        }
      } else if (name) {
        out.add(name)
      }
    } else if (name && !isGeneric) {
      // Leaf category: treat as a brand (e.g. standalone "Honda"). Skip generic buckets like "Car".
      out.add(name)
    }
  }
  return Array.from(out).sort((a, b) => a.localeCompare(b))
}

/** Prefer brand names from the category tree; fallback to inventory-derived brands from `getCarFilterOptions`. */
export function mergeBrandOptionsFromCategoryTree(
  filterOptions: CarFilterOptionsSnapshot,
  categoryRoots: HttpTypes.StoreProductCategory[] | null | undefined
): CarFilterOptionsSnapshot {
  const fromTree = getBrandNamesFromCategoryTree(categoryRoots)
  return {
    ...filterOptions,
    brands: fromTree.length > 0 ? fromTree : filterOptions.brands,
  }
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
