-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'UpdateFileInstructionElement';
ALTER TYPE "NotificationType" ADD VALUE 'UpdateFollowupElement';

-- AlterTable
ALTER TABLE "social_support" ADD COLUMN     "last_updated_by_id" UUID;

-- AddForeignKey
ALTER TABLE "social_support" ADD CONSTRAINT "social_support_last_updated_by_id_fkey" FOREIGN KEY ("last_updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
