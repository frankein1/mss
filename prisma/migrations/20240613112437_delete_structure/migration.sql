-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_type_id_fkey";

-- DropForeignKey
ALTER TABLE "partner_organization" DROP CONSTRAINT "partner_organization_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "partner_organization_contact" DROP CONSTRAINT "partner_organization_contact_partner_id_fkey";

-- AlterTable
ALTER TABLE "structure" ADD COLUMN     "disable" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "followup_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_organization" ADD CONSTRAINT "partner_organization_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_organization_contact" ADD CONSTRAINT "partner_organization_contact_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partner_organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "structure" ADD COLUMN     "last_access" TIMESTAMP(3);

update structure s set "last_access" = (
    select max(last_access) from "user" u where u.structure_id = s.id
);