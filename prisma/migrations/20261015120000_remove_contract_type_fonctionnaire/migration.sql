/*
 Migrate beneficiaries with contract type `Fonctionnaire` to `Titulaire`,
 then remove the `Fonctionnaire` value from the `BeneficiaryContractType` enum.
 */
-- AlterEnum
BEGIN;

UPDATE "beneficiary"
SET "contract_type" = 'Titulaire'
WHERE "contract_type" = 'Fonctionnaire';

CREATE TYPE "BeneficiaryContractType_new" AS ENUM (
  'CDI',
  'CDD',
  'CDDU',
  'CUI',
  'Interim',
  'Intermittence',
  'Apprentissage',
  'Stage',
  'Volontariat',
  'Titulaire',
  'Contractuel',
  'Stagiaire',
  'Eleve'
);

ALTER TABLE "beneficiary"
ALTER COLUMN "contract_type" TYPE "BeneficiaryContractType_new" USING ("contract_type"::text::"BeneficiaryContractType_new");

ALTER TYPE "BeneficiaryContractType"
RENAME TO "BeneficiaryContractType_old";

ALTER TYPE "BeneficiaryContractType_new"
RENAME TO "BeneficiaryContractType";

DROP TYPE "BeneficiaryContractType_old";

COMMIT;
