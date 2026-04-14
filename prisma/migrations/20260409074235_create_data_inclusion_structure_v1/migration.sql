-- CreateTable
CREATE TABLE "public"."data_inclusion_structure_v1" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),
    "siret" TEXT,
    "address" TEXT,
    "address_complement" TEXT,
    "city" TEXT,
    "zipcode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "working_hours" TEXT,

    CONSTRAINT "data_inclusion_structure_v1_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "public"."partner_organization" ADD COLUMN     "data_inclusion_id_v1" TEXT;

-- AddForeignKey
ALTER TABLE "public"."partner_organization" ADD CONSTRAINT "partner_organization_data_inclusion_id_v1_fkey" FOREIGN KEY ("data_inclusion_id_v1") REFERENCES "public"."data_inclusion_structure_v1"("id") ON DELETE SET NULL ON UPDATE CASCADE;
