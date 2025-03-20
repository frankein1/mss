/*
  Warnings:

  - Added the required column `structure_id` to the `archived_beneficiary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "archived_beneficiary" ADD COLUMN     "structure_id" UUID;

-- AddForeignKey
ALTER TABLE "archived_beneficiary" ADD CONSTRAINT "archived_beneficiary_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Migration: adding structure to existing archived_beneficiaries

UPDATE archived_beneficiary ab
SET
  structure_id = (SELECT structure_id FROM public.user u WHERE u.id = ab.archived_by_id)
WHERE ab.structure_id IS NULL;