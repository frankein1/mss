/*
  Warnings:

  - You are about to alter the column `main_income_amount` on the `beneficiary` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `partner_main_income_amount` on the `beneficiary` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `major_children_main_income_amount` on the `beneficiary` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "beneficiary" ALTER COLUMN "main_income_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "partner_main_income_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "major_children_main_income_amount" SET DATA TYPE INTEGER;
