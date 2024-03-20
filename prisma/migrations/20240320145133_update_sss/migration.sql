/*
  Warnings:

  - You are about to drop the column `legacy_id` on the `followup_type` table. All the data in the column will be lost.
  - You are about to drop the column `legally_required` on the `followup_type` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "followup_type" DROP COLUMN "legacy_id",
DROP COLUMN "legally_required";
