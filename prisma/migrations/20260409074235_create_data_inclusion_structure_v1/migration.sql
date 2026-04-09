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
