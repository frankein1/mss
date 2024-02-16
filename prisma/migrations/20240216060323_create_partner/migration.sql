-- DropForeignKey
ALTER TABLE "file_instruction" DROP CONSTRAINT "file_instruction_instructor_organization_id_fkey";
ALTER TABLE "followup" DROP CONSTRAINT "followup_prescribing_organization_id_fkey";
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_prescribing_organization_id_fkey";
ALTER TABLE "instructor_organization" DROP CONSTRAINT "instructor_organization_created_by_id_fkey";
ALTER TABLE "instructor_organization" DROP CONSTRAINT "instructor_organization_structure_id_fkey";
ALTER TABLE "prescribing_organization" DROP CONSTRAINT "prescribing_organization_created_by_id_fkey";
ALTER TABLE "prescribing_organization" DROP CONSTRAINT "prescribing_organization_structure_id_fkey";

-- AlterEnum
ALTER TYPE "UserActivityObject" ADD VALUE 'PartnerOrganization';

-- CreateTable
CREATE TABLE "partner_organization" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID,
    "name" TEXT NOT NULL,
    "structure_id" UUID NOT NULL,
    "siret" TEXT,
    "address" TEXT,
    "zipcode" TEXT,
    "city" TEXT,
    "email" TEXT,
    "phone1" TEXT,
    "phone2" TEXT,
    "working_hours" TEXT,
    CONSTRAINT "partner_organization_pkey" PRIMARY KEY ("id")
);

insert into partner_organization (id, created, created_by_id, name, structure_id) (
  select id, created, created_by_id, name, structure_id FROM prescribing_organization
);

UPDATE instructor_organization org SET structure_id = (
  SELECT ss.structure_id
    FROM social_support ss, file_instruction fi
    WHERE ss.id = fi.social_support_id
      AND instructor_organization_id = org.id
  )
  WHERE structure_id is null;

DELETE from instructor_organization where structure_id is null;

insert into partner_organization (id, created, created_by_id, name, structure_id) (
  select id, created, created_by_id, name, structure_id FROM instructor_organization
);

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_prescribing_organization_id_fkey" FOREIGN KEY ("prescribing_organization_id") REFERENCES "partner_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "file_instruction" ADD CONSTRAINT "file_instruction_instructor_organization_id_fkey" FOREIGN KEY ("instructor_organization_id") REFERENCES "partner_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_prescribing_organization_id_fkey" FOREIGN KEY ("prescribing_organization_id") REFERENCES "partner_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "partner_organization" ADD CONSTRAINT "partner_organization_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "partner_organization" ADD CONSTRAINT "partner_organization_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- DropTable
DROP TABLE "instructor_organization";
DROP TABLE "prescribing_organization";

