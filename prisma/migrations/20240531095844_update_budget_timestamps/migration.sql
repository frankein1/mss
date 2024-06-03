-- AlterTable
ALTER TABLE "budget" ADD COLUMN     "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "budget_expenses" ADD COLUMN     "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "budget_expenses_debt" ADD COLUMN     "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "budget_expenses_loan" ADD COLUMN     "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "budget_income" ADD COLUMN     "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3);

/** Set previous timestamps to date of migration */
UPDATE budget SET created = CURRENT_TIMESTAMP;
UPDATE budget SET updated = CURRENT_TIMESTAMP;

UPDATE budget_expenses SET created = CURRENT_TIMESTAMP;
UPDATE budget_expenses SET updated = CURRENT_TIMESTAMP;

UPDATE budget_expenses_debt SET created = CURRENT_TIMESTAMP;
UPDATE budget_expenses_debt SET updated = CURRENT_TIMESTAMP;

UPDATE budget_expenses_loan SET created = CURRENT_TIMESTAMP;
UPDATE budget_expenses_loan SET updated = CURRENT_TIMESTAMP;

UPDATE budget_income SET created = CURRENT_TIMESTAMP;
UPDATE budget_income SET updated = CURRENT_TIMESTAMP;
