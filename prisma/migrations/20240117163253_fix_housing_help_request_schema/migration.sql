/*
 Warnings:
 
 - Changed the column `asked_housing` on the `housing_help_request` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.
 
 */
-- AlterTable
ALTER TABLE "housing_help_request"
ALTER COLUMN "is_first" DROP NOT NULL;

ALTER TABLE "housing_help_request"
ADD COLUMN "asked_housing_tmp" "AskedHousing" [];

UPDATE housing_help_request
SET asked_housing_tmp = Array ["asked_housing"];

ALTER TABLE "housing_help_request" DROP COLUMN "asked_housing";

ALTER TABLE "housing_help_request"
  RENAME COLUMN "asked_housing_tmp" TO "asked_housing";
