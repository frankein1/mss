-- AlterTable
ALTER TABLE "notification" ADD COLUMN "read_at" TIMESTAMP(3);

-- Backfill: already-read notifications get the migration date
UPDATE "notification" SET "read_at" = NOW() WHERE "read" = true;
