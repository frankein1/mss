-- FILE INSTRUCTION - START

-- CreateEnum
CREATE TYPE "FileInstructionRefusalReason" AS ENUM ('ResourcesOutOfScale', 'ShortDeadline', 'IncompleteFile', 'IrregularSituation', 'InadequateFamilyComposition', 'ExpiredRequest', 'MissedAppointment', 'AlreadyExistingHelpRequest', 'Reoriented', 'Debt', 'Other');
CREATE TYPE "FileInstructionReason" AS ENUM ('Energy', 'Food', 'Housing', 'Other', 'Violences', 'DivorceSeparation', 'RapprochementFamilial', 'Mutation', 'Expulsion', 'LogementInsalubre', 'LogementNonDecent', 'LogementReprisVente', 'LogementInadapte', 'LogementTropCher', 'LogementBientotDemoli', 'Localisation', 'SansLogementOuTemporaire');
CREATE TYPE "FileInstructionType" AS ENUM ('Financial', 'Housing', 'Other');

-- CreateTable
CREATE TABLE "file_instruction" (
    "id" UUID NOT NULL,
    "type" "FileInstructionType",
    "updated" TIMESTAMP(3),
    "instructor_organization_id" UUID,
    "external_structure" BOOLEAN NOT NULL,
    "examination_date" DATE,
    "decision_date" DATE,
    "refusal_reason" "FileInstructionRefusalReason",
    "refusal_reason_other" TEXT,
    "dispatch_date" DATE,
    "full_file" BOOLEAN,
    "reason" "FileInstructionReason",
    "social_support_id" UUID NOT NULL,

    CONSTRAINT "file_instruction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file_instruction" ADD CONSTRAINT "file_instruction_instructor_organization_id_fkey" FOREIGN KEY ("instructor_organization_id") REFERENCES "instructor_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "file_instruction" ADD CONSTRAINT "file_instruction_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "file_instruction_social_support_id_key" ON "file_instruction"("social_support_id");

-- FILE INSTRUCTION - END

-- HELP REQUEST - START

INSERT INTO file_instruction (id, "type",  updated, instructor_organization_id, external_structure, examination_date, decision_date, refusal_reason, refusal_reason_other, dispatch_date, full_file, reason, social_support_id)
  SELECT gen_random_uuid(), 'Other', updated, instructor_organization_id, external_structure, examination_date, decision_date, CAST(refusal_reason::TEXT AS "FileInstructionRefusalReason"), refusal_reason_other, dispatch_date, full_file, CAST(reason::TEXT AS "FileInstructionReason"), social_support_id FROM help_request;

ALTER TABLE "help_request" ADD COLUMN "file_instruction_id" UUID NULL;

UPDATE "help_request" hr SET "file_instruction_id" = (
  SELECT fi.id from file_instruction fi WHERE fi.social_support_id = hr.social_support_id
);

ALTER TABLE "help_request" ALTER COLUMN "file_instruction_id" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_instructor_organization_id_fkey";
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_social_support_id_fkey";

-- DropIndex
DROP INDEX "help_request_social_support_id_key";
DROP INDEX "housing_help_request_social_support_id_key";

ALTER TABLE "help_request" DROP COLUMN "decision_date",
DROP COLUMN "dispatch_date",
DROP COLUMN "examination_date",
DROP COLUMN "external_structure",
DROP COLUMN "full_file",
DROP COLUMN "instructor_organization_id",
DROP COLUMN "reason",
DROP COLUMN "refusal_reason",
DROP COLUMN "refusal_reason_other",
DROP COLUMN "social_support_id",
DROP COLUMN "updated";

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_file_instruction_id_fkey" FOREIGN KEY ("file_instruction_id") REFERENCES "file_instruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "help_request_file_instruction_id_key" ON "help_request"("file_instruction_id");

-- HELP REQUEST - END

-- HOUSING - START

-- DropForeignKey
ALTER TABLE "housing_help_request" DROP CONSTRAINT "housing_help_request_instructor_organization_id_fkey";
ALTER TABLE "housing_help_request" DROP CONSTRAINT "housing_help_request_social_support_id_fkey";

-- AlterTable
ALTER TABLE "housing_help_request" DROP COLUMN "decision_date",
DROP COLUMN "dispatch_date",
DROP COLUMN "examination_date",
DROP COLUMN "external_structure",
DROP COLUMN "full_file",
DROP COLUMN "instructor_organization_id",
DROP COLUMN "reason",
DROP COLUMN "refusal_reason",
DROP COLUMN "social_support_id",
DROP COLUMN "updated",
ADD COLUMN  "file_instruction_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "housing_help_request_file_instruction_id_key" ON "housing_help_request"("file_instruction_id");

-- AddForeignKey
ALTER TABLE "housing_help_request" ADD CONSTRAINT "housing_help_request_file_instruction_id_fkey" FOREIGN KEY ("file_instruction_id") REFERENCES "file_instruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- HOUSING - END

-- DropEnum
DROP TYPE "HousingReason";
DROP TYPE "HelpRequestReason";
DROP TYPE "HelpRequestRefusalReason";



