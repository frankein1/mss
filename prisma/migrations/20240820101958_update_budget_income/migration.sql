/*
  Warnings:

  - A unique constraint covering the columns `[beneficiary_id]` on the table `budget_income` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "budget_income" ADD COLUMN     "beneficiary_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "budget_income_beneficiary_id_key" ON "budget_income"("beneficiary_id");

-- AddForeignKey
ALTER TABLE "budget_income" ADD CONSTRAINT "budget_income_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
