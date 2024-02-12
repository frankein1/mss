/*
 Warnings:
 
 - You are about to drop the column `subject` on the `help_request` table. All the data in the column will be lost.
 - Made the column `financial_support` on table `help_request` required. This step will fail if there are existing NULL values in that column.
 - Made the column `external_structure` on table `help_request` required. This step will fail if there are existing NULL values in that column.
 
 */
UPDATE help_request
SET financial_support = TRUE
WHERE "subject" = 'Financial';

UPDATE help_request
SET financial_support = false
WHERE "subject" = 'Other';

UPDATE help_request
SET financial_support = false
WHERE financial_support = NULL;

UPDATE help_request
SET external_structure = false
WHERE external_structure = NULL;

-- AlterTable
ALTER TABLE "help_request" DROP COLUMN "subject",
  ALTER COLUMN "financial_support"
SET NOT NULL,
  ALTER COLUMN "external_structure"
SET NOT NULL;

-- DropEnum
DROP TYPE "FileInstructionType";
