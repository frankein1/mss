-- CreateTable
CREATE TABLE "Income" (
    "id" UUID NOT NULL,
    "hostedRelative" "RelativeRelationship",
    "incomeSource" "IncomeSource"[],
    "incomeAmount" DECIMAL(65,30),
    "beneficiaryId" UUID,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
