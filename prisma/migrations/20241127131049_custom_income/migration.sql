-- CreateTable
CREATE TABLE "budget_income_custom" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),
    "type" TEXT,
    "amount" DECIMAL(65,30),
    "income_id" UUID NOT NULL,

    CONSTRAINT "budget_income_custom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budget_income_custom" ADD CONSTRAINT "budget_income_custom_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "budget_income"("id") ON DELETE CASCADE ON UPDATE CASCADE;
