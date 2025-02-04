-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SocialSupportStatus" ADD VALUE 'RdvSeen';
ALTER TYPE "SocialSupportStatus" ADD VALUE 'RdvNoShow';
ALTER TYPE "SocialSupportStatus" ADD VALUE 'RdvExcused';
ALTER TYPE "SocialSupportStatus" ADD VALUE 'RdvRevoked';
ALTER TYPE "SocialSupportStatus" ADD VALUE 'RdvUnknown';

-- AlterEnum
ALTER TYPE "SocialSupportType" ADD VALUE 'Appointment';

-- AlterEnum
ALTER TYPE "UserActivityObject" ADD VALUE 'Appointment';

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "external_rdvsp_id" TEXT;

-- AlterTable
ALTER TABLE "structure" ADD COLUMN     "external_rdvsp_active" BOOLEAN,
ADD COLUMN     "external_rdvsp_id" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "external_rdvsp_id" TEXT;

-- CreateTable
CREATE TABLE "external_account" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "external_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" UUID NOT NULL,
    "draft" BOOLEAN NOT NULL,
    "external_draft_id" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "duration_in_min" DECIMAL(65,30),
    "place" TEXT,
    "subject" TEXT,
    "external_subject_id" TEXT,
    "external_rdvsp_id" TEXT,
    "agent_id" UUID,
    "social_support_id" UUID NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_account_provider_provider_account_id_key" ON "external_account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_social_support_id_key" ON "appointment"("social_support_id");

-- AddForeignKey
ALTER TABLE "external_account" ADD CONSTRAINT "external_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;
