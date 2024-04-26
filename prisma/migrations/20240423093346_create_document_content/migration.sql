-- CreateTable
CREATE TABLE "document_content" (
    "id" TEXT NOT NULL,
    "document_key" TEXT NOT NULL,
    "content" BYTEA NOT NULL,

    CONSTRAINT "document_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_content_document_key_key" ON "document_content"("document_key");

-- AddForeignKey
ALTER TABLE "document_content" ADD CONSTRAINT "document_content_document_key_fkey" FOREIGN KEY ("document_key") REFERENCES "document"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "document" ADD COLUMN     "migrated" BOOLEAN NOT NULL DEFAULT false;

