/*
  Warnings:

  - You are about to drop the column `insurance` on the `budget_expenses` table. All the data in the column will be lost.
  - You are about to drop the `budget_expenses_debts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `budget_expenses_loans` table. If the table is not empty, all the data it contains will be lost.

*/

/** Rename table budget_expenses_debts and associated constraints */

-- RenameForeignKey
ALTER TABLE "budget_expenses_debts"
  RENAME CONSTRAINT "budget_expenses_debts_expenses_id_fkey" TO "budget_expenses_debt_expenses_id_fkey";

-- AlterTable
ALTER TABLE "budget_expenses_debts"
  RENAME CONSTRAINT "budget_expenses_debts_pkey" TO "budget_expenses_debt_pkey";


-- AlterTable
ALTER TABLE "budget_expenses_debts"
  RENAME TO "budget_expenses_debt";

/** Rename table budget_expenses_loans and associated constraints */

-- RenameForeignKey
ALTER TABLE "budget_expenses_loans"
  RENAME CONSTRAINT "budget_expenses_loans_expenses_id_fkey" TO "budget_expenses_loan_expenses_id_fkey";

-- AlterTable
ALTER TABLE "budget_expenses_loans"
  RENAME CONSTRAINT "budget_expenses_loans_pkey" TO "budget_expenses_loan_pkey";

-- AlterTable
ALTER TABLE "budget_expenses_loans"
  RENAME TO "budget_expenses_loan";

/** Add insurances fields */

-- AlterTable
ALTER TABLE "budget_expenses"
  RENAME COLUMN "insurance" TO "other_insurance";

-- AlterTable
ALTER TABLE "budget_expenses"
ADD COLUMN     "death_insurance" DECIMAL(65,30),
ADD COLUMN     "home_insurance" DECIMAL(65,30),
ADD COLUMN     "retirement_insurance" DECIMAL(65,30);
