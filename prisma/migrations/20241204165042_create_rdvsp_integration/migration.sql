-- AlterEnum
ALTER TYPE "SocialSupportType" ADD VALUE 'Appointment';

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "external_rdvsp_id" TEXT;

-- AlterTable
ALTER TABLE "structure" ADD COLUMN     "external_rdvsp_active" BOOLEAN,
ADD COLUMN     "external_rdvsp_id" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "external_rdvsp_active" BOOLEAN,
ADD COLUMN     "external_rdvsp_id" TEXT;

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
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "duration_in_min" DECIMAL(65,30) NOT NULL,
    "place" TEXT NOT NULL,
    "agent_id" UUID NOT NULL,
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
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;
