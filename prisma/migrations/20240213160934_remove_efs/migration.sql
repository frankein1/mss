/*
 Warnings:
 
 - The values [EFS] on the enum `StructureType` will be removed. If these variants are still used in the database, this will fail.
 
 */
-- AlterEnum
BEGIN;

DELETE FROM beneficiary
WHERE structure_id IN (
    SELECT id
    FROM structure
    WHERE "type" = 'EFS'
  );

DELETE FROM "user"
WHERE structure_id IN (
    SELECT id
    FROM structure
    WHERE "type" = 'EFS'
  );

DELETE FROM structure
WHERE "type" = 'EFS';

CREATE TYPE "StructureType_new" AS ENUM (
  'Ccas',
  'Cias',
  'Commune',
  'Association',
  'Ministere'
);

ALTER TABLE "structure"
ALTER COLUMN "type" TYPE "StructureType_new" USING ("type"::text::"StructureType_new");

ALTER TYPE "StructureType"
RENAME TO "StructureType_old";

ALTER TYPE "StructureType_new"
RENAME TO "StructureType";

DROP TYPE "StructureType_old";

COMMIT;
