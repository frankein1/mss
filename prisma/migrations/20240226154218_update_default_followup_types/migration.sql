/*
 Warnings:
 
 - The values [AidesFinancieresNonRemboursables,AidesFinancieresRemboursables] on the enum `DefaultFollowupType` will be removed. If these variants are still used in the database, this will fail.
 
 */
-- AlterEnum
BEGIN;

UPDATE followup_type
SET "default" = NULL
WHERE "default" IN (
    'AidesFinancieresNonRemboursables',
    'AidesFinancieresRemboursables'
  );

CREATE TYPE "DefaultFollowupType_new" AS ENUM (
  'AideChauffage',
  'AideImpayesEnergieFluides',
  'AideMedicaleDEtat',
  'AideSociale',
  'AllocationDeSolidariteAuxPersonnesAgees',
  'AllocationPersonnaliseesDAutonomie',
  'ComplementaireSanteSolidaire',
  'DemandeDAidesMenageres',
  'Domiciliation',
  'DossierFSL',
  'EntreeEnEtablissementPourPersonnesHandicapees',
  'EntreeEnFamilleDAccueil',
  'EntreeEnHebergementPourPersonnesAgees',
  'ObligationAlimentaire',
  'Puma',
  'RevenuDeSolidariteActive',
  'AccompagnementSocial',
  'AideAlimentaire',
  'AideAuTransport',
  'AnimationsFamilles',
  'AnimationsSeniors',
  'CAP',
  'InclusionNumerique',
  'Other',
  'PlanAlerteEtUrgence',
  'SoutienAdministratif',
  'SoutienCreationActivite'
);

ALTER TABLE "followup_type"
ALTER COLUMN "default" TYPE "DefaultFollowupType_new" USING ("default"::text::"DefaultFollowupType_new");

ALTER TYPE "DefaultFollowupType"
RENAME TO "DefaultFollowupType_old";

ALTER TYPE "DefaultFollowupType_new"
RENAME TO "DefaultFollowupType";

DROP TYPE "DefaultFollowupType_old";

COMMIT;
