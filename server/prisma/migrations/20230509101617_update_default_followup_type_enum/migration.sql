/*
  Warnings:

  - You are about to drop the column `default_legally_not_required_key` on the `followup_type` table. All the data in the column will be lost.
  - You are about to drop the column `default_legally_required_key` on the `followup_type` table. All the data in the column will be lost.
  - You are about to drop the column `legacy_default` on the `followup_type` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DefaultFollowupType" AS ENUM ('AideMedicaleDEtat', 'AideSociale', 'AllocationDeSolidariteAuxPersonnesAgees', 'AllocationPersonnaliseesDAutonomie', 'ComplementaireSanteSolidaire', 'DemandeDAidesMenageres', 'Domiciliation', 'EntreeEnEtablissementPourPersonnesHandicapees', 'EntreeEnFamilleDAccueil', 'EntreeEnHebergementPourPersonnesAgees', 'ObligationAlimentaire', 'Puma', 'RevenuDeSolidariteActive', 'AccompagnementSocial', 'AideAlimentaire', 'AideAuTransport', 'AidesFinancieresNonRemboursables', 'AidesFinancieresRemboursables', 'AnimationsFamilles', 'AnimationsSeniors', 'InclusionNumerique', 'Other', 'PlanAlerteEtUrgence', 'SoutienAdministratif');

-- AlterTable
ALTER TABLE "followup_type" ADD COLUMN "default" "DefaultFollowupType";

UPDATE "followup_type" set "default" = CAST(CAST("default_legally_required_key" as text) as "DefaultFollowupType") where "default_legally_required_key" is not null;
UPDATE "followup_type" set "default" = CAST(CAST("default_legally_not_required_key" as text) as "DefaultFollowupType") where "default_legally_not_required_key" is not null;

ALTER TABLE "followup_type" DROP COLUMN "default_legally_not_required_key",
DROP COLUMN "default_legally_required_key",
DROP COLUMN "legacy_default";

-- DropEnum
DROP TYPE "DefaultLegallyNotRequiredFollowupType";

-- DropEnum
DROP TYPE "DefaultLegallyRequiredFollowupType";
