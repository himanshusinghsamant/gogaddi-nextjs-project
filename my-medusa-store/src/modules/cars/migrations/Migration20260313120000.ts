import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260313120000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      create table if not exists "seller_car" (
        "id" text not null,
        "customer_id" text not null,
        "title" text not null default '',
        "brand" text not null default '',
        "car_model" text not null default '',
        "car_type" text not null default 'Used',
        "year" text not null default '',
        "fuel_type" text not null default '',
        "transmission" text not null default '',
        "km_driven" text not null default '',
        "city" text not null default '',
        "color" text not null default '',
        "engine" text not null default '',
        "mileage" text not null default '',
        "owner" text not null default '',
        "description" text not null default '',
        "images" jsonb not null default '[]',
        "expected_price" numeric not null default 0,
        "status" text not null default 'pending',
        "product_id" text null,
        "rejection_reason" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "seller_car_pkey" primary key ("id")
      );
    `)
    this.addSql(`create index if not exists "IDX_seller_car_customer_id" on "seller_car" ("customer_id");`)
    this.addSql(`create index if not exists "IDX_seller_car_status" on "seller_car" ("status");`)
    this.addSql(`create index if not exists "IDX_seller_car_deleted_at" on "seller_car" ("deleted_at") where deleted_at is null;`)
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "seller_car" cascade;`)
  }
}
