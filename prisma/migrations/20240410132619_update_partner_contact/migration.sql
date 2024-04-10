-- AlterTable
ALTER TABLE "file_instruction" ADD COLUMN     "instructor_organization_contact_id" UUID;

-- AlterTable
ALTER TABLE "help_request" ADD COLUMN     "prescribing_organization_contact_id" UUID;

-- AddForeignKey
ALTER TABLE "file_instruction" ADD CONSTRAINT "file_instruction_instructor_organization_contact_id_fkey" FOREIGN KEY ("instructor_organization_contact_id") REFERENCES "partner_organization_contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_prescribing_organization_contact_id_fkey" FOREIGN KEY ("prescribing_organization_contact_id") REFERENCES "partner_organization_contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
