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

-- migrate data to fill budget_income of type Beneficiary with the beneficiary id
-- 1a. join budget, income and beneficiary
-- 1b. only consider incomes with no household_member_id, those are incomes from main beneficiary
-- 2. link found beneficiary to income: unambiguous since only 1 beneficiary per family file at this stage
with income_ben as (
  SELECT
    bi.id as biid,
    ben.id as benid
  FROM
    budget_income bi
    JOIN budget as bu ON bi.budget_id = bu.id
    JOIN beneficiary as ben ON ben.family_file_id = bu.family_file_id
  WHERE bi.household_member_id IS NULL AND bi.beneficiary_id IS NULL
)
UPDATE budget_income bi
SET beneficiary_id = income_ben.benid
FROM income_ben
WHERE bi.id = income_ben.biid;