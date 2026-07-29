-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "prescribing_organization_contact_id" UUID,
ADD COLUMN     "prescribing_organization_id" UUID;

-- CreateTable
CREATE TABLE "beneficiary_contributing_partner" (
    "id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "partner_organization_id" UUID NOT NULL,
    "partner_organization_contact_id" UUID,
    "precisions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beneficiary_contributing_partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "beneficiary_contributing_partner_beneficiary_id_idx" ON "beneficiary_contributing_partner"("beneficiary_id");

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_prescribing_organization_id_fkey" FOREIGN KEY ("prescribing_organization_id") REFERENCES "partner_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_prescribing_organization_contact_id_fkey" FOREIGN KEY ("prescribing_organization_contact_id") REFERENCES "partner_organization_contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary_contributing_partner" ADD CONSTRAINT "beneficiary_contributing_partner_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary_contributing_partner" ADD CONSTRAINT "beneficiary_contributing_partner_partner_organization_id_fkey" FOREIGN KEY ("partner_organization_id") REFERENCES "partner_organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary_contributing_partner" ADD CONSTRAINT "beneficiary_contributing_partner_partner_organization_cont_fkey" FOREIGN KEY ("partner_organization_contact_id") REFERENCES "partner_organization_contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
