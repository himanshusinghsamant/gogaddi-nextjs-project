import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260320090000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "car_review"
      ADD COLUMN IF NOT EXISTS "status" text not null default 'published',
      ADD COLUMN IF NOT EXISTS "is_flagged" boolean not null default false,
      ADD COLUMN IF NOT EXISTS "flagged_words" text null;
    `)
    this.addSql(`create index if not exists "IDX_car_review_status" on "car_review" ("status");`)
    this.addSql(`create index if not exists "IDX_car_review_is_flagged" on "car_review" ("is_flagged");`)
  }

  async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_car_review_status";`)
    this.addSql(`drop index if exists "IDX_car_review_is_flagged";`)
    this.addSql(`
      ALTER TABLE "car_review"
      DROP COLUMN IF EXISTS "status",
      DROP COLUMN IF EXISTS "is_flagged",
      DROP COLUMN IF EXISTS "flagged_words";
    `)
  }
}
