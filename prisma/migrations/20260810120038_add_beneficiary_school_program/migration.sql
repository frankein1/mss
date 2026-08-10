-- CreateEnum
CREATE TYPE "BeneficiarySchoolProgram" AS ENUM ('ClasseRelais', 'Upe2a', 'Upe2aNsa');

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN "school_program" "BeneficiarySchoolProgram"[];
