-- CreateTable
CREATE TABLE "support_program_exit_reason" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_program_exit_reason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "support_program_exit_reason_structure_id_name_key" ON "support_program_exit_reason"("structure_id", "name");

-- AddForeignKey
ALTER TABLE "support_program_exit_reason" ADD CONSTRAINT "support_program_exit_reason_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_program_exit_reason" ADD CONSTRAINT "support_program_exit_reason_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "support_program" DROP COLUMN "exit_reason",
ADD COLUMN     "exit_reason_id" UUID;

-- CreateIndex
CREATE INDEX "support_program_exit_reason_id_idx" ON "support_program"("exit_reason_id");

-- AddForeignKey
ALTER TABLE "support_program" ADD CONSTRAINT "support_program_exit_reason_id_fkey" FOREIGN KEY ("exit_reason_id") REFERENCES "support_program_exit_reason"("id") ON DELETE SET NULL ON UPDATE CASCADE;
