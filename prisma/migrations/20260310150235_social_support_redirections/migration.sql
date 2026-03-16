-- CreateEnum
CREATE TYPE "public"."SocialSupportRedirectionType" AS ENUM ('PartnerOrganization', 'Intern', 'Other');

-- CreateTable
CREATE TABLE "public"."social_support_redirection" (
    "id" UUID NOT NULL,
    "type" "public"."SocialSupportRedirectionType" NOT NULL,
    "motif" TEXT,
    "external_structure_name" TEXT,
    "partner_organization_id" UUID,
    "partner_organization_contact_id" UUID,
    "social_support_id" UUID NOT NULL,

    CONSTRAINT "social_support_redirection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."social_support_redirection" ADD CONSTRAINT "social_support_redirection_partner_organization_id_fkey" FOREIGN KEY ("partner_organization_id") REFERENCES "public"."partner_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."social_support_redirection" ADD CONSTRAINT "social_support_redirection_partner_organization_contact_id_fkey" FOREIGN KEY ("partner_organization_contact_id") REFERENCES "public"."partner_organization_contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."social_support_redirection" ADD CONSTRAINT "social_support_redirection_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "public"."social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;


--- Migrate redirection informations from followups
INSERT INTO social_support_redirection (
    id,
    type,
    external_structure_name,
    social_support_id
)
SELECT
    gen_random_uuid(),
    'Other' AS type,
    f.structure_name AS external_structure_name,
    f.social_support_id
FROM followup f
JOIN social_support ss
    ON ss.id = f.social_support_id
WHERE f.redirected = true;