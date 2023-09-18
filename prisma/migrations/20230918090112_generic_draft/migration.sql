/*
  Warnings:

  - You are about to drop the column `street_number` on the `beneficiary` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserActivityObject" ADD VALUE 'Draft';

-- AlterTable
ALTER TABLE "beneficiary" DROP COLUMN "street_number",
ADD COLUMN     "post_office_box" TEXT;

-- CreateTable
CREATE TABLE "draft" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID,
    "content" JSONB,

    CONSTRAINT "draft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "draft" ADD CONSTRAINT "draft_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft" ADD CONSTRAINT "draft_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
