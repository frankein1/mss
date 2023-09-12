/*
  Warnings:

  - The `general` column on the `beneficiary_draft` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `taxHousehold` column on the `beneficiary_draft` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `relatives` column on the `beneficiary_draft` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `health` column on the `beneficiary_draft` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `occupationIncome` column on the `beneficiary_draft` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `externalOrganisations` column on the `beneficiary_draft` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "beneficiary_draft" DROP COLUMN "general",
ADD COLUMN     "general" JSONB,
DROP COLUMN "taxHousehold",
ADD COLUMN     "taxHousehold" JSONB,
DROP COLUMN "relatives",
ADD COLUMN     "relatives" JSONB,
DROP COLUMN "health",
ADD COLUMN     "health" JSONB,
DROP COLUMN "occupationIncome",
ADD COLUMN     "occupationIncome" JSONB,
DROP COLUMN "externalOrganisations",
ADD COLUMN     "externalOrganisations" JSONB;
