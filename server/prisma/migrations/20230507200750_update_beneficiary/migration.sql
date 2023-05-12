/*
  Warnings:

  - The `pension_organisations` column on the `beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PensionOrganisation" AS ENUM ('AGIRC_ARRCO', 'AG2R', 'CNAV_CARSAT', 'CIPAV', 'CNRACL', 'EDF', 'IRCANTEC', 'KLESIA', 'SRE', 'SSI', 'MalakoffHumanis', 'MSA', 'ProBTP', 'RetraiteDesMines', 'Other');

-- AlterTable
ALTER TABLE "beneficiary" DROP COLUMN "pension_organisations",
ADD COLUMN     "pension_organisations" "PensionOrganisation"[];
