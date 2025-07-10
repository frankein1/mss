-- CreateEnum
CREATE TYPE "WorkshopAttendeeAttendance" AS ENUM ('Seen', 'NoShow', 'Excused');

-- CreateEnum
CREATE TYPE "WorkshopAttendeeType" AS ENUM ('Beneficiary', 'External', 'Accompanying');

-- CreateEnum
CREATE TYPE "WorkshopAttendeeListType" AS ENUM ('Main', 'Waiting');

-- CreateTable
CREATE TABLE "workshop_attendee" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),
    "workshop_id" UUID NOT NULL,
    "attendance" "WorkshopAttendeeAttendance",
    "type" "WorkshopAttendeeType" NOT NULL,
    "list_type" "WorkshopAttendeeListType" NOT NULL,
    "comment" TEXT,
    "beneficiary_id" UUID,
    "workshop_external_attendee_id" UUID,

    CHECK ((beneficiary_id IS NOT NULL AND workshop_external_attendee_id IS NULL) OR (beneficiary_id IS NULL AND workshop_external_attendee_id IS NOT NULL)),

    CONSTRAINT "workshop_attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshop_external_attendee" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),
    "first_name" TEXT,
    "last_name" TEXT,
    "gender" "Gender",
    "email" TEXT,
    "phone" TEXT,
    "birth_date" DATE,

    CONSTRAINT "workshop_external_attendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workshop_attendee_workshop_external_attendee_id_key" ON "workshop_attendee"("workshop_external_attendee_id");

-- AddForeignKey
ALTER TABLE "workshop_attendee" ADD CONSTRAINT "workshop_attendee_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop_attendee" ADD CONSTRAINT "workshop_attendee_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop_attendee" ADD CONSTRAINT "workshop_attendee_workshop_external_attendee_id_fkey" FOREIGN KEY ("workshop_external_attendee_id") REFERENCES "workshop_external_attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
