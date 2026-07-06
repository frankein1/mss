-- AlterEnum
ALTER TYPE "BeneficiarySocioProfessionalCategory" ADD VALUE 'PublicEmployee';
ALTER TYPE "BeneficiarySocioProfessionalCategory" ADD VALUE 'Apprentice';

-- CreateEnum
CREATE TYPE "BeneficiaryContractType" AS ENUM ('CDI', 'CDD', 'CDDU', 'CUI', 'Interim', 'Intermittence', 'Apprentissage', 'Stage', 'Volontariat', 'Titulaire', 'Contractuel', 'Fonctionnaire');

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN "contract_type" "BeneficiaryContractType";
