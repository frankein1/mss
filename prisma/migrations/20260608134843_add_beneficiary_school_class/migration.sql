-- CreateEnum
CREATE TYPE "public"."BeneficiarySchoolClass" AS ENUM ('ToutesPetiteSection', 'PetiteSection', 'MoyenneSection', 'GrandeSection', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', 'Sixieme', 'Cinquieme', 'Quatrieme', 'Troisieme', 'SecondeGenerale', 'PremiereGenerale', 'PremiereTechno', 'TerminaleGenerale', 'TerminaleTechno', 'SecondePro', 'PremierePro', 'TerminalePro', 'CAP1', 'CAP2', 'BMA1', 'BMA2', 'BNMA1', 'BNMA2', 'BNMA3');

-- AlterTable
ALTER TABLE "public"."beneficiary" ADD COLUMN "school_class" "public"."BeneficiarySchoolClass";
