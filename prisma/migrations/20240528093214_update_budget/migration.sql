/*
  Warnings:

  - You are about to drop the column `remaining_after_expenses` on the `budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "budget"
  ADD COLUMN     "banque_de_france" DECIMAL(65,30),
  ADD COLUMN     "number_household_members" DECIMAL(65,30);

ALTER TABLE "budget"
  RENAME COLUMN "remaining_after_expenses" TO "legacy_remaining_after_expenses";