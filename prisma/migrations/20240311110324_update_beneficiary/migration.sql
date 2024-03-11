-- CreateEnum
CREATE TYPE "BeneficiaryVulnerablePersonType" AS ENUM ('PersonneIsolee', 'PlanAlerteEtUrgence', 'PlanCommunalSauvegarde', 'Other');

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "vulnerable_person" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "beneficiary" ADD COLUMN     "vulnerable_person_type" "BeneficiaryVulnerablePersonType";
