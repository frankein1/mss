-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

ALTER TYPE "NotificationType" ADD VALUE 'ArchiveDueSevenDays';
ALTER TYPE "NotificationType" ADD VALUE 'ArchiveDueOneMonth';
COMMIT;
-- Migrate archive notifications created with type ArchiveDue to ArchiveDueOneMonth
update notification set type = 'ArchiveDueOneMonth' where type = 'ArchiveDue';