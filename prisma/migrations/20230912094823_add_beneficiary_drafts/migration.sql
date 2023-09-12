-- CreateTable
CREATE TABLE "beneficiary_draft" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID,
    "general" TEXT,
    "taxHousehold" TEXT,
    "relatives" TEXT,
    "health" TEXT,
    "occupationIncome" TEXT,
    "externalOrganisations" TEXT,

    CONSTRAINT "beneficiary_draft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "beneficiary_draft" ADD CONSTRAINT "beneficiary_draft_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary_draft" ADD CONSTRAINT "beneficiary_draft_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
