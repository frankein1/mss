-- CreateEnum
CREATE TYPE "public"."PartnerOrganizationDataSource" AS ENUM ('Custom', 'DataInclusionV1', 'LegacyDataInclusionV0');

-- AlterTable
ALTER TABLE "public"."partner_organization" ADD COLUMN     "data_source" "public"."PartnerOrganizationDataSource" NOT NULL DEFAULT 'Custom';

-- Fill data source for partners from Data Inclusion API v1
UPDATE "public"."partner_organization"
SET "data_source" = 'DataInclusionV1'
WHERE "data_inclusion_id_v1" IS NOT NULL;

-- Fill data source for partners from Data Inclusion Legacy API v0
UPDATE "public"."partner_organization"
SET "data_source" = 'LegacyDataInclusionV0'
WHERE "data_inclusion_id" IS NOT NULL AND "data_inclusion_id_v1" IS NULL;

-- Copy v0 structure fields to LegacyDataInclusionV0 partner orgs (all except siret)
UPDATE "public"."partner_organization" po
SET
  name           = dis.name,
  address        = dis.address,
  city           = dis.city,
  zipcode        = dis.zipcode,
  phone1         = dis.phone,
  email          = dis.email,
  working_hours  = dis.working_hours
FROM "public"."data_inclusion_structure" dis
WHERE po.data_inclusion_id = dis.id
  AND po.data_source = 'LegacyDataInclusionV0';

-- Copy v0 siret to LegacyDataInclusionV0 partner orgs (only where no unique conflict)
UPDATE "public"."partner_organization" po
SET siret = dis.siret
FROM "public"."data_inclusion_structure" dis
WHERE po.data_inclusion_id = dis.id
  AND po.data_source = 'LegacyDataInclusionV0'
  AND dis.siret IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "public"."partner_organization" other
    WHERE other.structure_id = po.structure_id
      AND other.siret = dis.siret
      AND other.id != po.id
  );

-- Refresh DataInclusionV1 partner org name from V1 structure
UPDATE "public"."partner_organization" po
SET name = v1.name
FROM "public"."data_inclusion_structure_v1" v1
WHERE po.data_inclusion_id_v1 = v1.id
  AND po.data_source = 'DataInclusionV1';
