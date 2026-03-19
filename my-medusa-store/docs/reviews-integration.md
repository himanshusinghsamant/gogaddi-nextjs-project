# Car Reviews Integration

Reviews are stored in the **cars** module (`car_review` table) and linked to a product by `product_id`. No core Medusa tables are modified.

---

## Data model

| Field          | Type   | Notes                    |
|----------------|--------|--------------------------|
| `id`           | uuid   | Primary key              |
| `product_id`   | string | Medusa product ID        |
| `reviewer_name`| string | Display name             |
| `rating`       | number | 1–5                      |
| `review_text`  | text   | Optional                 |
| `status`       | string | `published` or `pending` |
| `is_flagged`   | bool   | Auto true on bad words   |
| `flagged_words`| text   | Matched moderation words |
| `created_at`   | timestamp | Set by framework      |

---

## Store (frontend) API

Use these from your storefront or any public client.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/store/cars/:id/reviews` | List reviews for a car (product id). Response: `{ reviews: [{ id, reviewer_name, rating, review_text, created_at }, ...] }`. |
| POST   | `/store/cars/:id/reviews` | Submit a review. Body: `{ reviewer_name?, rating, review_text? }`. Rating is clamped 1–5. If review text contains blocked words, review is saved as `pending` and hidden from storefront. |

When a customer submits a review, admin notification email is sent automatically if `RESEND_API_KEY` and either `CHECKOUT_EMAIL_TO` or `ADMIN_EMAIL` are configured.

**Example – fetch reviews (storefront):**
```ts
const productId = "prod_xxx" // or get from GET /store/cars/:handle
const res = await fetch(`${API_URL}/store/cars/${productId}/reviews`)
const { reviews } = await res.json()
```

**Example – submit review (customer):**
```ts
await fetch(`${API_URL}/store/cars/${productId}/reviews`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    reviewer_name: "John",
    rating: 5,
    review_text: "Great car.",
  }),
})
```

For production, consider:
- Requiring customer auth and saving `customer_id` (e.g. in metadata or an extra column).
- Rate limiting (e.g. one review per customer per product).

---

## Admin API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/admin/cars/:id/reviews` | List reviews for product `:id`. |
| POST   | `/admin/cars/:id/reviews` | Add a review. Body: `{ reviewer_name?, rating, review_text? }`. |
| PUT    | `/admin/cars/:id/reviews/:reviewId` | Update a review. Body: `{ reviewer_name?, rating, review_text? }`. |
| DELETE | `/admin/cars/:id/reviews/:reviewId` | Delete a review. |
| GET    | `/admin/car-reviews?flagged=true|false` | Central review list for moderation page. |
| DELETE | `/admin/car-reviews/:id` | Delete a customer review from central moderation page. |

Use when building custom admin UIs or automating review creation.

---

## Admin UI

### Product Widget (Car Reviews)

The **Car Reviews** widget is registered on the product details page (`product.details.after`). It:

- Lists all reviews for the current product.
- Provides a form to add a review (reviewer name, rating 1–5, review text).
- **Edit**: click "Edit" on a row to load it into the form, then "Update review" to save.
- **Delete**: click "Delete" on a row; confirm to remove the review.

So you can manage car reviews (add, edit, delete) directly from **Products** without going to a separate Cars admin page.

### Extension Page (Customer Reviews)

There is also a dedicated admin extension page named **Customer Reviews**. It:

- Lists all customer reviews globally (not per product only).
- Supports filtering by flagged/non-flagged.
- Shows review status and flagged words.
- Lets admin delete inappropriate reviews quickly.

---

## Where reviews appear

- **GET /store/cars** – each car includes a `reviews` array (same shape as above).
- **GET /store/cars/:handle** – full car payload includes `reviews`.
- **GET /store/cars/:id/reviews** – dedicated endpoint for a single car’s reviews.

Use the store endpoints to drive your storefront car and review UI.
