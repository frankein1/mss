/*
  Warnings:

  - The `accommodation_zone` column on the `beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `no_phone` on table `beneficiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `caregiver` on table `beneficiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hosted` on table `beneficiary_relative` required. This step will fail if there are existing NULL values in that column.
  - Made the column `caregiver` on table `beneficiary_relative` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BeneficiaryAccomodationZone" AS ENUM ('France', 'Europe', 'OutsideEurope');

-- AlterTable
UPDATE "beneficiary" set "no_phone" = false where "no_phone" is null;
UPDATE "beneficiary" set "caregiver" = false where "caregiver" is null;
ALTER TABLE "beneficiary" ALTER COLUMN "no_phone" SET NOT NULL,
ALTER COLUMN "no_phone" SET DEFAULT false,
ALTER COLUMN "caregiver" SET NOT NULL,
ALTER COLUMN "caregiver" SET DEFAULT false,
DROP COLUMN "accommodation_zone",
ADD COLUMN     "accommodation_zone" "BeneficiaryAccomodationZone";

-- AlterTable
UPDATE "beneficiary_relative" set "hosted" = false where "hosted" is null;
UPDATE "beneficiary_relative" set "caregiver" = false where "caregiver" is null;
ALTER TABLE "beneficiary_relative" ALTER COLUMN "hosted" SET NOT NULL,
ALTER COLUMN "hosted" SET DEFAULT false,
ALTER COLUMN "caregiver" SET NOT NULL,
ALTER COLUMN "caregiver" SET DEFAULT false;

-- DropEnum
DROP TYPE "AccomodationZone";
