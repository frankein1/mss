-- CreateEnum
CREATE TYPE "LowIncomeHousingType" AS ENUM ('PLAI', 'PLUS', 'PLS', 'PLI');

-- AlterTable
ALTER TABLE "housing_help_request" ADD COLUMN     "low_income_housing_type" "LowIncomeHousingType"[];
