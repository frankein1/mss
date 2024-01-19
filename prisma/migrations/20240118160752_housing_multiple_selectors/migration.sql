/*
 Warnings:
 
 - The `room_count` column on the `housing_help_request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
 - Changed the column `housing_type` on the `housing_help_request` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.
 
 */
-- CreateEnum
CREATE TYPE "HousingRoomCount" AS ENUM (
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'SixAndMore'
);

-- AlterTable
ALTER TABLE "housing_help_request"
ALTER COLUMN "is_first" DROP NOT NULL,
  ADD COLUMN "housing_type_tmp" "HousingType" [],
  DROP COLUMN "room_count",
  ADD COLUMN "room_count" "HousingRoomCount" [];

UPDATE housing_help_request
SET housing_type_tmp = Array [ "housing_type"];

ALTER TABLE housing_help_request DROP COLUMN housing_type;

ALTER TABLE housing_help_request
  RENAME COLUMN "housing_type_tmp" TO "housing_type";
