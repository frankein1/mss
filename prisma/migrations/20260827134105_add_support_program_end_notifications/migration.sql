-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'SupportProgramEndToday';
ALTER TYPE "NotificationType" ADD VALUE 'SupportProgramEndSixtyDays';

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "support_program_id" UUID;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_support_program_id_fkey" FOREIGN KEY ("support_program_id") REFERENCES "support_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
