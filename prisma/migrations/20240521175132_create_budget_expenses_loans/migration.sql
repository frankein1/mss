-- CreateTable
CREATE TABLE "BudgetExpensesLoans" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "amount_total" DECIMAL(65,30),
    "amount_per_month" DECIMAL(65,30),
    "due_date" TIMESTAMP(3),
    "expenses_id" UUID NOT NULL,

    CONSTRAINT "BudgetExpensesLoans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BudgetExpensesLoans" ADD CONSTRAINT "BudgetExpensesLoans_expenses_id_fkey" FOREIGN KEY ("expenses_id") REFERENCES "budget_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
