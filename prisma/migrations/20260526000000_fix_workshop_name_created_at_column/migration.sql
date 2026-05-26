-- Fix: rename column "created_by" to "created_at" in workshop_name table.
-- (column was mistakenly mapped with @map("created_by") instead of @map("created_at"))
ALTER TABLE "public"."workshop_name" RENAME COLUMN "created_by" TO "created_at";
