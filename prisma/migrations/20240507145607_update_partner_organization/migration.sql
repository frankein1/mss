-- AlterTable
ALTER TABLE "partner_organization" ADD COLUMN     "data_inclusion_id" TEXT;

-- AddForeignKey
ALTER TABLE "partner_organization" ADD CONSTRAINT "partner_organization_data_inclusion_id_fkey" FOREIGN KEY ("data_inclusion_id") REFERENCES "data_inclusion_structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
