import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260315100000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "car_booking"
      ADD COLUMN IF NOT EXISTS "customer_id" text null;
    `)
    this.addSql(`create index if not exists "IDX_car_booking_customer_id" on "car_booking" ("customer_id");`)
  }

  async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_car_booking_customer_id";`)
    this.addSql(`ALTER TABLE "car_booking" DROP COLUMN IF EXISTS "customer_id";`)
  }
}
