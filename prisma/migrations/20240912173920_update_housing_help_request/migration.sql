-- AlterTable
ALTER TABLE "housing_help_request" ADD COLUMN     "prescribing_organization_contact_id" UUID,
ADD COLUMN     "prescribing_organization_id" UUID;

-- AddForeignKey
ALTER TABLE "housing_help_request" ADD CONSTRAINT "housing_help_request_prescribing_organization_id_fkey" FOREIGN KEY ("prescribing_organization_id") REFERENCES "partner_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing_help_request" ADD CONSTRAINT "housing_help_request_prescribing_organization_contact_id_fkey" FOREIGN KEY ("prescribing_organization_contact_id") REFERENCES "partner_organization_contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
