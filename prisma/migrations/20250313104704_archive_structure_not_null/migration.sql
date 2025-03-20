/*
  Warnings:

  - Made the column `structure_id` on table `archived_beneficiary` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "archived_beneficiary" ALTER COLUMN "structure_id" SET NOT NULL;
