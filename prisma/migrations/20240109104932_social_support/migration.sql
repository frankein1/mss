/*
 Warnings:
 
 - The values [Housing] on the enum `HelpRequestSubject` will be removed. If these variants are still used in the database, this will fail.
 - You are about to drop the column `followup_id` on the `comment` table. All the data in the column will be lost.
 - You are about to drop the column `help_request_id` on the `comment` table. All the data in the column will be lost.
 - You are about to drop the column `beneficiary_id` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `created` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `created_by_id` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `date` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `ministre` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `numero_pegase` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `private_synthesis` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `status` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `structure_id` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `synthesis` on the `followup` table. All the data in the column will be lost.
 - You are about to drop the column `beneficiary_id` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `created` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `created_by_id` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `ministre` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `numero_pegase` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `opening_date` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `private_synthesis` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `status` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `structure_id` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `synthesis` on the `help_request` table. All the data in the column will be lost.
 - You are about to drop the column `followup_id` on the `notification` table. All the data in the column will be lost.
 - You are about to drop the column `help_request_id` on the `notification` table. All the data in the column will be lost.
 - You are about to drop the `_document_to_followup` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `_document_to_help_request` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `_followup_to_followup_type` table. If the table is not empty, all the data it contains will be lost.
 - A unique constraint covering the columns `[social_support_id]` on the table `followup` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[social_support_id]` on the table `help_request` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `social_support_id` to the `followup` table without a default value. This is not possible if the table is not empty.
 - Added the required column `social_support_id` to the `help_request` table without a default value. This is not possible if the table is not empty.
 
 */
/**
 ****************
 * CREATE ENUMS *
 ****************
 */
-- CreateEnum
CREATE TYPE "SocialSupportStatus" AS ENUM (
    'WaitingAdditionalInformation',
    'InvestigationOngoing',
    'Accepted',
    'Refused',
    'Adjourned',
    'ClosedByBeneficiary',
    'ClosedByAgent',
    'Dismissed',
    'Todo',
    'InProgress',
    'Done'
);

-- CreateEnum
CREATE TYPE "AskedHousing" AS ENUM (
    'ParcSocial',
    'ParcPrive',
    'HebergementTemporaire'
);

-- CreateEnum
CREATE TYPE "HousingReason" AS ENUM (
    'Violences',
    'DivorceSeparation',
    'RapprochementFamilial',
    'Mutation',
    'Expulsion',
    'LogementInsalubre',
    'LogementNonDecent',
    'LogementReprisVente',
    'LogementInadapte',
    'LogementTropCher',
    'LogementBientotDemoli',
    'Localisation',
    'SansLogementOuTemporaire'
);

-- CreateEnum
CREATE TYPE "HousingType" AS ENUM ('Maison', 'Appartement');

/**
 *****************
 * CREATE TABLES *
 *****************
 */
-- CreateTable
CREATE TABLE "social_support" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "synthesis" TEXT,
    "private_synthesis" TEXT,
    "ministre" "Minister",
    "numero_pegase" TEXT,
    "status" "SocialSupportStatus" NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),
    CONSTRAINT "social_support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "housing_help_request" (
    "id" UUID NOT NULL,
    "updated" TIMESTAMP(3),
    "instructor_organization_id" UUID,
    "external_structure" BOOLEAN,
    "examination_date" DATE,
    "decision_date" DATE,
    "refusal_reason" "HelpRequestRefusalReason",
    "dispatch_date" DATE,
    "due_date" DATE,
    "full_file" BOOLEAN,
    "is_first" BOOLEAN NOT NULL,
    "first_opening_date" DATE,
    "asked_housing" "AskedHousing",
    "reason" "HousingReason",
    "unique_id" TEXT,
    "tax_household_additional_information" TEXT,
    "max_rent" DECIMAL(65, 30),
    "max_charges" DECIMAL(65, 30),
    "housing_type" "HousingType",
    "room_count" DECIMAL(65, 30),
    "is_pmr" BOOLEAN,
    "social_support_id" UUID NOT NULL,
    CONSTRAINT "housing_help_request_pkey" PRIMARY KEY ("id")
);

/**
 **********************
 * CREATE JOIN TABLES *
 **********************
 */
-- CreateTable
CREATE TABLE "_document_to_social_support" ("A" TEXT NOT NULL, "B" UUID NOT NULL);

-- CreateTable
CREATE TABLE "_social_support_to_followup_type" ("A" UUID NOT NULL, "B" UUID NOT NULL);

/**
 ***********************
 * CREATE FOREIGN KEYS *
 ***********************
 */
-- AlterTable
ALTER TABLE "comment"
ADD COLUMN "social_support_id" UUID;

-- AlterTable
ALTER TABLE "followup"
ADD COLUMN "social_support_id" UUID;

-- AlterTable
ALTER TABLE "help_request"
ADD COLUMN "social_support_id" UUID;

-- AlterTable
ALTER TABLE "notification"
ADD COLUMN "social_support_id" UUID;

/**
 ******************
 * CREATE INDEXES *
 ******************
 */
-- CreateIndex
CREATE UNIQUE INDEX "housing_help_request_social_support_id_key" ON "housing_help_request"("social_support_id");

-- CreateIndex
CREATE UNIQUE INDEX "_document_to_social_support_AB_unique" ON "_document_to_social_support"("A", "B");

-- CreateIndex
CREATE INDEX "_document_to_social_support_B_index" ON "_document_to_social_support"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_social_support_to_followup_type_AB_unique" ON "_social_support_to_followup_type"("A", "B");

-- CreateIndex
CREATE INDEX "_social_support_to_followup_type_B_index" ON "_social_support_to_followup_type"("B");

-- CreateIndex
CREATE UNIQUE INDEX "followup_social_support_id_key" ON "followup"("social_support_id");

-- CreateIndex
CREATE UNIQUE INDEX "help_request_social_support_id_key" ON "help_request"("social_support_id");

/**
 ********************
 * ADD FOREIGN KEYS *
 ********************
 */
-- AddForeignKey
ALTER TABLE "social_support"
ADD CONSTRAINT "social_support_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_support"
ADD CONSTRAINT "social_support_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_support"
ADD CONSTRAINT "social_support_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup"
ADD CONSTRAINT "followup_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request"
ADD CONSTRAINT "help_request_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing_help_request"
ADD CONSTRAINT "housing_help_request_instructor_organization_id_fkey" FOREIGN KEY ("instructor_organization_id") REFERENCES "instructor_organization"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing_help_request"
ADD CONSTRAINT "housing_help_request_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment"
ADD CONSTRAINT "comment_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification"
ADD CONSTRAINT "notification_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document_to_social_support"
ADD CONSTRAINT "_document_to_social_support_A_fkey" FOREIGN KEY ("A") REFERENCES "document"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document_to_social_support"
ADD CONSTRAINT "_document_to_social_support_B_fkey" FOREIGN KEY ("B") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_social_support_to_followup_type"
ADD CONSTRAINT "_social_support_to_followup_type_A_fkey" FOREIGN KEY ("A") REFERENCES "followup_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_social_support_to_followup_type"
ADD CONSTRAINT "_social_support_to_followup_type_B_fkey" FOREIGN KEY ("B") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/**
 ****************
 * MIGRATE DATA *
 ****************
 */
-- Used for gen_random_uuid function
CREATE EXTENSION pgcrypto;

/**
 *************************
 * MIGRATE FOLLOWUP DATA *
 *************************
 */
INSERT INTO "social_support" (
        "id",
        "structure_id",
        "beneficiary_id",
        "created_by_id",
        "date",
        "synthesis",
        "private_synthesis",
        "ministre",
        "numero_pegase",
        "status",
        "created",
        "updated"
    )
SELECT gen_random_uuid() AS "id",
    "structure_id",
    "beneficiary_id",
    "created_by_id",
    "date",
    "synthesis",
    "private_synthesis",
    "ministre",
    "numero_pegase",
    "status"::text::"SocialSupportStatus",
    "created",
    "updated"
FROM "followup";

UPDATE "followup" fu
SET "social_support_id" = (
        SELECT id
        FROM "social_support" ss
        WHERE fu."structure_id" = ss."structure_id"
            AND fu."beneficiary_id" = ss."beneficiary_id"
            AND fu."created_by_id" = ss."created_by_id"
            AND fu."date" = ss."date"
            AND fu."created" = ss."created"
            AND fu."updated" = ss."updated"
    );

INSERT INTO _social_support_to_followup_type ("A", "B")
SELECT ff_ft."B",
    ss.id
FROM _followup_to_followup_type ff_ft
    INNER JOIN followup ff ON ff.id = ff_ft."A"
    INNER JOIN social_support ss ON ss.id = ff.social_support_id;

INSERT INTO _document_to_social_support ("A", "B")
SELECT d_ff."A",
    ss.id
FROM _document_to_followup d_ff
    INNER JOIN followup ff ON ff.id = d_ff."B"
    INNER JOIN social_support ss ON ss.id = ff.social_support_id;

UPDATE "comment" c
SET social_support_id = (
        SELECT social_support_id
        FROM followup fu
        WHERE fu.id = c.followup_id
    )
WHERE c.followup_id IS NOT NULL;

UPDATE notification n
SET social_support_id = (
        SELECT social_support_id
        FROM followup fu
        WHERE fu.id = n.followup_id
    )
WHERE n.followup_id IS NOT NULL;

/**
 *****************************
 * MIGRATE HELP REQUEST DATA *
 *****************************
 */
INSERT INTO "social_support" (
        "id",
        "structure_id",
        "beneficiary_id",
        "created_by_id",
        "date",
        "synthesis",
        "private_synthesis",
        "ministre",
        "numero_pegase",
        "status",
        "created",
        "updated"
    )
SELECT gen_random_uuid() AS "id",
    "structure_id",
    "beneficiary_id",
    "created_by_id",
    "opening_date",
    "synthesis",
    "private_synthesis",
    "ministre",
    "numero_pegase",
    "status"::text::"SocialSupportStatus",
    "created",
    "updated"
FROM "help_request";

UPDATE "help_request" hr
SET "social_support_id" = (
        SELECT id
        FROM "social_support" ss
        WHERE hr."structure_id" = ss."structure_id"
            AND hr."beneficiary_id" = ss."beneficiary_id"
            AND hr."created_by_id" = ss."created_by_id"
            AND hr."opening_date" = ss."date"
            AND hr."created" = ss."created"
            AND hr."updated" = ss."updated"
    );

INSERT INTO _social_support_to_followup_type ("A", "B")
SELECT hr.type_id,
    ss.id
FROM help_request hr
    INNER JOIN social_support ss ON ss.id = hr.social_support_id;

INSERT INTO _document_to_social_support ("A", "B")
SELECT d_hr."A",
    ss.id
FROM _document_to_help_request d_hr
    INNER JOIN help_request hr ON hr.id = d_hr."B"
    INNER JOIN social_support ss ON ss.id = hr.social_support_id;

UPDATE "comment" c
SET social_support_id = (
        SELECT social_support_id
        FROM help_request hr
        WHERE hr.id = c.help_request_id
    )
WHERE c.help_request_id IS NOT NULL;

UPDATE notification n
SET social_support_id = (
        SELECT social_support_id
        FROM help_request hr
        WHERE hr.id = n.help_request_id
    )
WHERE n.help_request_id IS NOT NULL;

/**
 ************************
 * NOT NULL CONSTRAINTS *
 ************************
 */
-- AlterTable
ALTER TABLE "comment"
ALTER COLUMN "social_support_id"
SET NOT NULL;

-- AlterTable
ALTER TABLE "followup"
ALTER COLUMN "social_support_id"
SET NOT NULL;

-- AlterTable
ALTER TABLE "help_request"
ALTER COLUMN "social_support_id"
SET NOT NULL;

/**
 ***********************************
 * REMOVE VIEWS *
 ***********************************
 */
DROP VIEW "view_beneficiary_history";

DROP VIEW "view_beneficiary_types";

/**
 ***************************************
 * REMOVE HOUSING HELP REQUEST SUBJECT *
 ***************************************
 */
-- AlterEnum
BEGIN;

CREATE TYPE "HelpRequestSubject_new" AS ENUM ('Financial', 'Other');

ALTER TABLE "help_request"
ALTER COLUMN "subject" TYPE "HelpRequestSubject_new" USING ("subject"::text::"HelpRequestSubject_new");

ALTER TYPE "HelpRequestSubject"
RENAME TO "HelpRequestSubject_old";

ALTER TYPE "HelpRequestSubject_new"
RENAME TO "HelpRequestSubject";

DROP TYPE "HelpRequestSubject_old";

COMMIT;

/**
 ************
 * CLEANING *
 ************
 */
-- DropForeignKey
ALTER TABLE "_document_to_followup" DROP CONSTRAINT "_document_to_followup_A_fkey";

-- DropForeignKey
ALTER TABLE "_document_to_followup" DROP CONSTRAINT "_document_to_followup_B_fkey";

-- DropForeignKey
ALTER TABLE "_document_to_help_request" DROP CONSTRAINT "_document_to_help_request_A_fkey";

-- DropForeignKey
ALTER TABLE "_document_to_help_request" DROP CONSTRAINT "_document_to_help_request_B_fkey";

-- DropForeignKey
ALTER TABLE "_followup_to_followup_type" DROP CONSTRAINT "_followup_to_followup_type_A_fkey";

-- DropForeignKey
ALTER TABLE "_followup_to_followup_type" DROP CONSTRAINT "_followup_to_followup_type_B_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_followup_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_help_request_id_fkey";

-- DropForeignKey
ALTER TABLE "followup" DROP CONSTRAINT "followup_beneficiary_id_fkey";

-- DropForeignKey
ALTER TABLE "followup" DROP CONSTRAINT "followup_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "followup" DROP CONSTRAINT "followup_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_beneficiary_id_fkey";

-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_followup_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_help_request_id_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "followup_id",
    DROP COLUMN "help_request_id";

-- AlterTable
ALTER TABLE "followup" DROP COLUMN "beneficiary_id",
    DROP COLUMN "created",
    DROP COLUMN "created_by_id",
    DROP COLUMN "date",
    DROP COLUMN "ministre",
    DROP COLUMN "numero_pegase",
    DROP COLUMN "private_synthesis",
    DROP COLUMN "status",
    DROP COLUMN "structure_id",
    DROP COLUMN "synthesis";

-- AlterTable
ALTER TABLE "help_request" DROP COLUMN "beneficiary_id",
    DROP COLUMN "created",
    DROP COLUMN "created_by_id",
    DROP COLUMN "ministre",
    DROP COLUMN "numero_pegase",
    DROP COLUMN "opening_date",
    DROP COLUMN "private_synthesis",
    DROP COLUMN "status",
    DROP COLUMN "structure_id",
    DROP COLUMN "synthesis";

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "followup_id",
    DROP COLUMN "help_request_id";

-- DropTable
DROP TABLE "_document_to_followup";

-- DropTable
DROP TABLE "_document_to_help_request";

-- DropTable
DROP TABLE "_followup_to_followup_type";

-- DropEnum
DROP TYPE "FollowupStatus";

-- DropEnum
DROP TYPE "HelpRequestStatus";
