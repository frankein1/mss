/*
  Warnings:

  - Changed the column `asked_housing` on the `housing_help_request` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "housing_help_request" ALTER COLUMN "is_first" DROP NOT NULL,
ALTER COLUMN "asked_housing" SET DATA TYPE "AskedHousing"[];
