-- AlterTable
ALTER TABLE "document" ADD COLUMN "encrypted_data_key" TEXT;

-- CreateIndex
-- NOTE: on production, consider running this with CONCURRENTLY to avoid locking the table
CREATE INDEX "document_migrated_idx" ON "document"("migrated") WHERE migrated = false;
