/*
  Warnings:

  - You are about to drop the column `street_number` on the `beneficiary` table. All the data in the column will be lost.

*/
-- AlterTable
UPDATE "beneficiary" SET "street" = CONCAT("street_number", ' ', "street") WHERE "street_number" IS NOT NULL;
ALTER TABLE "beneficiary" DROP COLUMN "street_number";
