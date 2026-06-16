-- AlterTable
ALTER TABLE "followup" ADD COLUMN     "support_program_id" UUID;

-- AlterTable
ALTER TABLE "help_request" ADD COLUMN     "support_program_id" UUID;

-- AlterTable
ALTER TABLE "housing_help_request" ADD COLUMN     "support_program_id" UUID;

-- CreateTable
CREATE TABLE "support_program_name" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_program_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_program" (
    "id" UUID NOT NULL,
    "beneficiary_id" UUID,
    "workshop_id" UUID,
    "support_program_name_id" UUID NOT NULL,
    "partner_organisation_id" UUID,
    "precisions" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "exit_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_program_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "check_support_program_beneficiary_or_workshop" CHECK ((beneficiary_id IS NOT NULL AND workshop_id IS NULL) OR (beneficiary_id IS NULL AND workshop_id IS NOT NULL))
);

-- CreateIndex
CREATE UNIQUE INDEX "support_program_name_structure_id_name_key" ON "support_program_name"("structure_id", "name");

-- CreateIndex
CREATE INDEX "support_program_beneficiary_id_idx" ON "support_program"("beneficiary_id");

-- CreateIndex
CREATE INDEX "support_program_support_program_name_id_idx" ON "support_program"("support_program_name_id");

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_support_program_id_fkey" FOREIGN KEY ("support_program_id") REFERENCES "support_program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_support_program_id_fkey" FOREIGN KEY ("support_program_id") REFERENCES "support_program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing_help_request" ADD CONSTRAINT "housing_help_request_support_program_id_fkey" FOREIGN KEY ("support_program_id") REFERENCES "support_program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_program_name" ADD CONSTRAINT "support_program_name_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_program_name" ADD CONSTRAINT "support_program_name_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_program" ADD CONSTRAINT "support_program_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_program" ADD CONSTRAINT "support_program_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_program" ADD CONSTRAINT "support_program_support_program_name_id_fkey" FOREIGN KEY ("support_program_name_id") REFERENCES "support_program_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_program" ADD CONSTRAINT "support_program_partner_organisation_id_fkey" FOREIGN KEY ("partner_organisation_id") REFERENCES "partner_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
