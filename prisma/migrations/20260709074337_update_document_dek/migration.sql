-- AlterTable
ALTER TABLE "document" ADD COLUMN     "encrypted_data_key" TEXT;

-- CreateIndex
CREATE INDEX "document_migrated_idx" ON "document"("migrated");

-- Enforce that any migrated document carries its encrypted data key.
-- (encrypted_data_key stays nullable for non-migrated documents; it will become
--  NOT NULL once the DB-to-S3 migration is finalized.)
ALTER TABLE "document" ADD CONSTRAINT "document_migrated_requires_dek"
  CHECK (NOT "migrated" OR "encrypted_data_key" IS NOT NULL);
