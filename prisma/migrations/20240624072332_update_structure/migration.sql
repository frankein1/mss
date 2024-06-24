/*
  Warnings:

  - You are about to drop the column `disable` on the `structure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "structure" DROP COLUMN "disable",
ADD COLUMN     "deactivation_alert_email" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "structure" ADD COLUMN     "deactivation_alert_email_date" TIMESTAMP(3);
