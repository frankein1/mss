/*
  Warnings:

  - The `ministere_structure` column on the `beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BeneficiaryMinistereStructure" AS ENUM ('AdministrationCentrale', 'Ars', 'DreetsDeetsOutreMer', 'Ddets', 'Ddetspp', 'Ddpp', 'InjaInjs', 'Ehesp', 'Intefp', 'Mnc', 'Retraites', 'Other');

-- AlterTable
ALTER TABLE "beneficiary" DROP COLUMN "ministere_structure",
ADD COLUMN     "ministere_structure" "BeneficiaryMinistereStructure";
