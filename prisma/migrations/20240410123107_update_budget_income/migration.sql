/*
  Warnings:

  - A unique constraint covering the columns `[household_member_id]` on the table `budget_income` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "budget_income" DROP CONSTRAINT "budget_income_beneficiary_relative_id_fkey";

-- DropIndex
DROP INDEX "budget_income_beneficiary_relative_id_key";

-- AlterTable
ALTER TABLE "budget_income"
  RENAME COLUMN "beneficiary_relative_id" TO "household_member_id";

-- CreateIndex
CREATE UNIQUE INDEX "budget_income_household_member_id_key" ON "budget_income"("household_member_id");

-- AddForeignKey
ALTER TABLE "budget_income" ADD CONSTRAINT "budget_income_household_member_id_fkey" FOREIGN KEY ("household_member_id") REFERENCES "beneficiary_relative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
