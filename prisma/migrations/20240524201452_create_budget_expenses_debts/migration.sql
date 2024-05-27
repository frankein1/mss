/*
  Warnings:

  - You are about to drop the column `debts` on the `budget_expenses` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "budget_expenses_debts" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "amount_total" DECIMAL(65,30),
    "amount_per_month" DECIMAL(65,30),
    "due_date" TIMESTAMP(3),
    "expenses_id" UUID NOT NULL,

    CONSTRAINT "budget_expenses_debts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budget_expenses_debts" ADD CONSTRAINT "budget_expenses_debts_expenses_id_fkey" FOREIGN KEY ("expenses_id") REFERENCES "budget_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/**
 ****************
 * MIGRATE BUDGET DEBTS DATA *
 ****************
 */
INSERT INTO budget_expenses_debts (id,amount_per_month,expenses_id) 
  SELECT gen_random_uuid(),debts,id FROM budget_expenses WHERE debts IS NOT NULL;

-- AlterTable
ALTER TABLE "budget_expenses" DROP COLUMN "debts";
