-- CreateEnum
CREATE TYPE "BeneficiaryActivityStatus" AS ENUM ('Rsa', 'Aah', 'FranceTravail', 'MissionLocale', 'Rqth', 'CongeMaternite', 'Disponibilite');

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "activity_status" "BeneficiaryActivityStatus"[];
