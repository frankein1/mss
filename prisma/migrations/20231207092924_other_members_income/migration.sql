-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "other_members_main_income_amount" DECIMAL(65,30),
ADD COLUMN     "other_members_main_income_source" "IncomeSource"[];
