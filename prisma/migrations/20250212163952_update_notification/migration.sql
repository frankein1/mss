-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'ArchiveDue';

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "archive_date" TIMESTAMP(3);
