-- CreateEnum
CREATE TYPE "BudgetIncomeType" AS ENUM ('Beneficiary', 'BeneficiaryRelative');

-- CreateTable
CREATE TABLE "budget_income" (
    "id" UUID NOT NULL,
    "legacy_income" DECIMAL(65,30),
    "salary" DECIMAL(65,30),
    "prime_activite" DECIMAL(65,30),
    "retirement" DECIMAL(65,30),
    "alimony" DECIMAL(65,30),
    "disability" DECIMAL(65,30),
    "unemployment" DECIMAL(65,30),
    "ass" DECIMAL(65,30),
    "rsa" DECIMAL(65,30),
    "apl" DECIMAL(65,30),
    "family" DECIMAL(65,30),
    "aah" DECIMAL(65,30),
    "aspa" DECIMAL(65,30),
    "daily_allowance" DECIMAL(65,30),
    "annuity" DECIMAL(65,30),
    "other" DECIMAL(65,30),
    "type" "BudgetIncomeType" NOT NULL,
    "beneficiary_relative_id" UUID,
    "budget_id" UUID NOT NULL,

    CONSTRAINT "budget_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_expenses" (
    "id" UUID NOT NULL,
    "rent" DECIMAL(65,30),
    "expenses" DECIMAL(65,30),
    "water" DECIMAL(65,30),
    "electricity" DECIMAL(65,30),
    "gas" DECIMAL(65,30),
    "fuel_or_other" DECIMAL(65,30),
    "housing_tax" DECIMAL(65,30),
    "property_tax" DECIMAL(65,30),
    "income_tax" DECIMAL(65,30),
    "remitted_alimony" DECIMAL(65,30),
    "health_insurance" DECIMAL(65,30),
    "phone_internet" DECIMAL(65,30),
    "insurance" DECIMAL(65,30),
    "car_insurance" DECIMAL(65,30),
    "school_fees" DECIMAL(65,30),
    "school_canteen" DECIMAL(65,30),
    "other" DECIMAL(65,30),
    "debts" DECIMAL(65,30),
    "loans" DECIMAL(65,30),
    "budget_id" UUID NOT NULL,

    CONSTRAINT "budget_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget" (
    "id" UUID NOT NULL,
    "remaining_after_expenses" DECIMAL(65,30),
    "savings" DECIMAL(65,30),
    "overdraft" DECIMAL(65,30),
    "family_quotient" DECIMAL(65,30),
    "beneficiary_id" UUID NOT NULL,

    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budget_income_beneficiary_relative_id_key" ON "budget_income"("beneficiary_relative_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_expenses_budget_id_key" ON "budget_expenses"("budget_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_beneficiary_id_key" ON "budget"("beneficiary_id");

-- AddForeignKey
ALTER TABLE "budget_income" ADD CONSTRAINT "budget_income_beneficiary_relative_id_fkey" FOREIGN KEY ("beneficiary_relative_id") REFERENCES "beneficiary_relative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_income" ADD CONSTRAINT "budget_income_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_expenses" ADD CONSTRAINT "budget_expenses_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
