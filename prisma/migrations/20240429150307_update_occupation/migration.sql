-- CreateEnum
CREATE TYPE "BeneficiaryStudyLevel" AS ENUM ('Brevet', 'CAP', 'Bac', 'BacPlus2', 'Licence', 'Master', 'Doctorat');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BeneficiarySocioProfessionalCategory" ADD VALUE 'Freelance';
ALTER TYPE "BeneficiarySocioProfessionalCategory" ADD VALUE 'Entrepreneur';

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "study_level" "BeneficiaryStudyLevel";
