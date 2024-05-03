-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'NewFollowupElement';
ALTER TYPE "NotificationType" RENAME VALUE 'NewHistoryElement' TO 'NewFileInstructionElement';
ALTER TYPE "NotificationType" ADD VALUE 'NewSocialSupportSubject';

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "structure_id" UUID,
ADD COLUMN "detail" TEXT,
ALTER COLUMN "beneficiary_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
