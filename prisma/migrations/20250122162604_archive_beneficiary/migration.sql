-- CreateEnum
CREATE TYPE "ArchiveReason" AS ENUM ('NoActivity', 'EndOfFollowup', 'Reorientation', 'Death', 'Displacement', 'Transfer', 'NotPresent', 'Other');

-- AlterEnum
ALTER TYPE "UserActivityObject" ADD VALUE 'ArchivedBeneficiary';

-- CreateTable
CREATE TABLE "archived_beneficiary" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "archived_by_id" UUID NOT NULL,
    "updated" TIMESTAMP(3),
    "title" "BeneficiaryTitle",
    "usual_name" TEXT,
    "birth_name" TEXT,
    "first_name" TEXT,
    "reason" "ArchiveReason",
    "event_date_reason" TIMESTAMP(3),
    "clarification" TEXT,
    "old_beneficiary_id" UUID NOT NULL,

    CONSTRAINT "archived_beneficiary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "archived_beneficiary" ADD CONSTRAINT "archived_beneficiary_archived_by_id_fkey" FOREIGN KEY ("archived_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
