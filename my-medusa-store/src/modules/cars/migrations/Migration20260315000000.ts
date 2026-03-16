import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260315000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      create table if not exists "car_booking" (
        "id" text not null,
        "car_id" text not null,
        "car_title" text null,
        "name" text not null,
        "email" text not null,
        "phone" text not null,
        "city" text not null,
        "preferred_date" text not null,
        "preferred_time" text not null,
        "message" text null,
        "status" text not null default 'pending',
        "verification_token" text not null,
        "is_email_verified" boolean not null default false,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "car_booking_pkey" primary key ("id")
      );
    `)
    this.addSql(`create index if not exists "IDX_car_booking_email" on "car_booking" ("email");`)
    this.addSql(`create index if not exists "IDX_car_booking_status" on "car_booking" ("status");`)
    this.addSql(`create unique index if not exists "IDX_car_booking_verification_token" on "car_booking" ("verification_token") where deleted_at is null;`)
    this.addSql(`create index if not exists "IDX_car_booking_deleted_at" on "car_booking" ("deleted_at") where deleted_at is null;`)
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "car_booking" cascade;`)
  }
}
