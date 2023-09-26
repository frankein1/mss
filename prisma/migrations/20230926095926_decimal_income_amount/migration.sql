-- AlterTable
ALTER TABLE "beneficiary" ALTER COLUMN "main_income_amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "partner_main_income_amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "major_children_main_income_amount" SET DATA TYPE DECIMAL(65,30);
