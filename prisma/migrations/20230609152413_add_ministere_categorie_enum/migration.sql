/*
  Warnings:

  - The `ministere_categorie` column on the `beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BeneficiaryMinistereCategorie" AS ENUM ('CategorieA', 'CategorieB', 'CategorieC', 'CadreDroitPrive', 'NonCadreDroitPrive');

-- AlterTable
ALTER TABLE "beneficiary" DROP COLUMN "ministere_categorie",
ADD COLUMN     "ministere_categorie" "BeneficiaryMinistereCategorie";
