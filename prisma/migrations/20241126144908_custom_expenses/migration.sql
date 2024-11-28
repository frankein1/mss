-- CreateTable
CREATE TABLE "budget_expenses_custom" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),
    "type" TEXT,
    "amount" DECIMAL(65,30),
    "expenses_id" UUID NOT NULL,

    CONSTRAINT "budget_expenses_custom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budget_expenses_custom" ADD CONSTRAINT "budget_expenses_custom_expenses_id_fkey" FOREIGN KEY ("expenses_id") REFERENCES "budget_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
