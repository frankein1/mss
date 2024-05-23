/*
  Warnings:

  - You are about to drop the column `loans` on the `budget_expenses` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "budget_expenses_loans" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "amount_total" DECIMAL(65,30),
    "amount_per_month" DECIMAL(65,30),
    "due_date" TIMESTAMP(3),
    "expenses_id" UUID NOT NULL,

    CONSTRAINT "budget_expenses_loans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budget_expenses_loans" ADD CONSTRAINT "budget_expenses_loans_expenses_id_fkey" FOREIGN KEY ("expenses_id") REFERENCES "budget_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/**
 ****************
 * MIGRATE BUDGET LOANS DATA *
 ****************
 */
INSERT INTO budget_expenses_loans (id,amount_per_month,expenses_id) 
  SELECT gen_random_uuid(),loans,id FROM budget_expenses WHERE loans IS NOT NULL;

-- AlterTable
ALTER TABLE "budget_expenses" DROP COLUMN "loans";
