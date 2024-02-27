-- CreateTable
CREATE TABLE "partner_organization_contact" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "partner_id" UUID NOT NULL,

    CONSTRAINT "partner_organization_contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "partner_organization_contact" ADD CONSTRAINT "partner_organization_contact_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partner_organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
