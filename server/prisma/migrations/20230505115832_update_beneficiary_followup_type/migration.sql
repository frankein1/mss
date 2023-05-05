/*
  Warnings:

  - You are about to drop the `proposed_followup_type` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `legacy_default` on table `followup_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owned_by_structured_id` on table `followup_type` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DefaultLegallyRequiredFollowupType" AS ENUM ('AideMedicaleDEtat', 'AideSociale', 'AllocationDeSolidariteAuxPersonnesAgees', 'AllocationPersonnaliseesDAutonomie', 'ComplementaireSanteSolidaire', 'DemandeDAidesMenageres', 'Domiciliation', 'EntreeEnEtablissementPourPersonnesHandicapees', 'EntreeEnFamilleDAccueil', 'EntreeEnHebergementPourPersonnesAgees', 'ObligationAlimentaire', 'Puma', 'RevenuDeSolidariteActive');

-- CreateEnum
CREATE TYPE "DefaultLegallyNotRequiredFollowupType" AS ENUM ('AccompagnementSocial', 'AideAlimentaire', 'AideAuTransport', 'AidesFinancieresNonRemboursables', 'AidesFinancieresRemboursables', 'AnimationsFamilles', 'AnimationsSeniors', 'InclusionNumerique', 'Other', 'PlanAlerteEtUrgence', 'SoutienAdministratif');

-- DropForeignKey
ALTER TABLE "followup_type" DROP CONSTRAINT "followup_type_owned_by_structured_id_fkey";

-- DropForeignKey
ALTER TABLE "proposed_followup_type" DROP CONSTRAINT "proposed_followup_type_followup_type_id_fkey";

-- DropForeignKey
ALTER TABLE "proposed_followup_type" DROP CONSTRAINT "proposed_followup_type_structure_id_fkey";

-- AlterTable
ALTER TABLE "followup_type" ADD COLUMN     "default_legally_not_required_key" "DefaultLegallyNotRequiredFollowupType",
ADD COLUMN     "default_legally_required_key" "DefaultLegallyRequiredFollowupType",
ALTER COLUMN "legacy_default" SET NOT NULL,
ALTER COLUMN "owned_by_structured_id" SET NOT NULL;

-- DropTable
DROP TABLE "proposed_followup_type";

-- AddForeignKey
ALTER TABLE "followup_type" ADD CONSTRAINT "followup_type_owned_by_structured_id_fkey" FOREIGN KEY ("owned_by_structured_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
