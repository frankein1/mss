/*
  Warnings:

  - Changed the type of `object` on the `user_activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserActivityObject" AS ENUM ('Comment', 'Beneficiary', 'HelpRequest', 'Followup', 'Structure', 'Document', 'Notification', 'User');

-- AlterTable
ALTER TABLE "user_activity" ADD COLUMN "object_tmp" "UserActivityObject";
UPDATE "user_activity" SET "object_tmp" = 'Comment' where "object" = 'Comment';
UPDATE "user_activity" SET "object_tmp" = 'Beneficiary' where "object" = 'Beneficiary';
UPDATE "user_activity" SET "object_tmp" = 'HelpRequest' where "object" = 'HelpRequest';
UPDATE "user_activity" SET "object_tmp" = 'Followup' where "object" = 'Followup';
UPDATE "user_activity" SET "object_tmp" = 'Structure' where "object" = 'Structure';
UPDATE "user_activity" SET "object_tmp" = 'Document' where "object" = 'Document';
UPDATE "user_activity" SET "object_tmp" = 'Notification' where "object" = 'Notification';
UPDATE "user_activity" SET "object_tmp" = 'User' where "object" = 'User';
ALTER TABLE "user_activity" DROP COLUMN "object";
ALTER TABLE "user_activity" RENAME COLUMN "object_tmp" TO "object";
ALTER TABLE "user_activity" ALTER COLUMN "object" SET NOT NULL;

