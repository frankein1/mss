-- CreateEnum
CREATE TYPE "BeneficiaryActivityStatus" AS ENUM ('Rsa', 'Aah', 'FranceTravail', 'MissionLocale', 'Rqth', 'CongeMaternite', 'Disponibilite', 'Invalidite', 'ArretMaladie');

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "activity_status" "BeneficiaryActivityStatus"[];

-- DataMigration: move Disability/SickLeave from socio_professional_category to activity_status
UPDATE "beneficiary"
SET "activity_status" = ARRAY[
  CASE "socio_professional_category"
    WHEN 'Disability' THEN 'Invalidite'
    WHEN 'SickLeave' THEN 'ArretMaladie'
  END]::"BeneficiaryActivityStatus"[],
    "socio_professional_category" = NULL
WHERE "socio_professional_category" IN ('Disability', 'SickLeave');
