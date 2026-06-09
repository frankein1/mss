-- AlterEnum
ALTER TYPE "UserActivityObject" ADD VALUE 'RedirectionReason';

-- AlterTable
ALTER TABLE "social_support_redirection" ADD COLUMN "redirection_reason_id" UUID;

-- CreateTable
CREATE TABLE "redirection_reason" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redirection_reason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "redirection_reason_structure_id_name_key" ON "redirection_reason"("structure_id", "name");

-- AddForeignKey
ALTER TABLE "social_support_redirection" ADD CONSTRAINT "social_support_redirection_redirection_reason_id_fkey" FOREIGN KEY ("redirection_reason_id") REFERENCES "redirection_reason"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redirection_reason" ADD CONSTRAINT "redirection_reason_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redirection_reason" ADD CONSTRAINT "redirection_reason_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
