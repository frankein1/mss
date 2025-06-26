-- CreateEnum
CREATE TYPE "AgeLimitCondition" AS ENUM ('GreaterThan', 'LowerThan');

-- CreateTable
CREATE TABLE "workshop" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "structureId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TEXT,
    "end_time" TEXT,
    "location" TEXT,
    "partner_organization_id" UUID,
    "host" TEXT,
    "session_name" TEXT,
    "description" TEXT,
    "attendee_limit" INTEGER,
    "ageLimitCondition" "AgeLimitCondition",
    "ageLimit" INTEGER,

    CONSTRAINT "workshop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_partner_organization_id_fkey" FOREIGN KEY ("partner_organization_id") REFERENCES "partner_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
