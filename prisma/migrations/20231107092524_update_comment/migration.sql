/*
  Warnings:

  - Made the column `created_by_id` on table `followup` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `help_request` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "followup" DROP CONSTRAINT "followup_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_created_by_id_fkey";

-- AlterTable
ALTER TABLE "followup" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "help_request" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "comment_id" UUID;

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
