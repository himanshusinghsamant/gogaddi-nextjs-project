-- Run this SQL against your PostgreSQL database if the seller_car table does not exist.
-- Example: psql -U your_user -d your_database -f create-seller-car-table.sql
-- Or paste into pgAdmin / any SQL client connected to your Medusa DB.

CREATE TABLE IF NOT EXISTS "seller_car" (
  "id" text NOT NULL,
  "customer_id" text NOT NULL,
  "title" text NOT NULL DEFAULT '',
  "brand" text NOT NULL DEFAULT '',
  "car_model" text NOT NULL DEFAULT '',
  "car_type" text NOT NULL DEFAULT 'Used',
  "year" text NOT NULL DEFAULT '',
  "fuel_type" text NOT NULL DEFAULT '',
  "transmission" text NOT NULL DEFAULT '',
  "km_driven" text NOT NULL DEFAULT '',
  "city" text NOT NULL DEFAULT '',
  "color" text NOT NULL DEFAULT '',
  "engine" text NOT NULL DEFAULT '',
  "mileage" text NOT NULL DEFAULT '',
  "owner" text NOT NULL DEFAULT '',
  "description" text NOT NULL DEFAULT '',
  "images" jsonb NOT NULL DEFAULT '[]',
  "expected_price" numeric NOT NULL DEFAULT 0,
  "status" text NOT NULL DEFAULT 'pending',
  "product_id" text NULL,
  "rejection_reason" text NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "seller_car_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "IDX_seller_car_customer_id" ON "seller_car" ("customer_id");
CREATE INDEX IF NOT EXISTS "IDX_seller_car_status" ON "seller_car" ("status");
CREATE INDEX IF NOT EXISTS "IDX_seller_car_deleted_at" ON "seller_car" ("deleted_at") WHERE deleted_at IS NULL;
