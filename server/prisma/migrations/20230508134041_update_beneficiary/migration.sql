/*
  Warnings:

  - You are about to drop the column `accomodation_additional_information` on the `beneficiary` table. All the data in the column will be lost.
  - You are about to drop the column `accomodation_mode` on the `beneficiary` table. All the data in the column will be lost.
  - You are about to drop the column `accomodation_name` on the `beneficiary` table. All the data in the column will be lost.
  - The `accommodation_zone` column on the `beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pension_organisations` column on the `beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BeneficiaryAccommodationMode" AS ENUM ('None', 'Owner', 'SocialRenting', 'PrivateRenting', 'Fortune', 'EmergencyHousing', 'Other', 'ThirdPerson', 'Parents', 'Substandard', 'NursingHome');

-- CreateEnum
CREATE TYPE "BeneficiaryAccommodationZone" AS ENUM ('France', 'Europe', 'OutsideEurope');

-- CreateEnum
CREATE TYPE "BeneficiaryPensionOrganisation" AS ENUM ('AgircArrco', 'Agr', 'CnavCarsat', 'Cipav', 'Cnracl', 'Edf', 'Ircantec', 'Klesia', 'Sre', 'Ssi', 'MalakoffHumanis', 'Msa', 'ProBtp', 'RetraiteDesMines', 'Other');

-- AlterTable
ALTER TABLE "beneficiary" DROP COLUMN "accomodation_additional_information",
DROP COLUMN "accomodation_mode",
DROP COLUMN "accomodation_name",
ADD COLUMN     "accommodation_additional_information" TEXT,
ADD COLUMN     "accommodation_mode" "BeneficiaryAccommodationMode",
ADD COLUMN     "accommodation_name" TEXT,
DROP COLUMN "accommodation_zone",
ADD COLUMN     "accommodation_zone" "BeneficiaryAccommodationZone",
DROP COLUMN "pension_organisations",
ADD COLUMN     "pension_organisations" "BeneficiaryPensionOrganisation"[];

-- DropEnum
DROP TYPE "BeneficiaryAccomodationMode";

-- DropEnum
DROP TYPE "BeneficiaryAccomodationZone";

-- DropEnum
DROP TYPE "PensionOrganisation";
