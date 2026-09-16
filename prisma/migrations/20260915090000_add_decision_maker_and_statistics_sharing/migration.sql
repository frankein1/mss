-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'DecisionMaker';

-- AlterEnum
ALTER TYPE "StructureType" ADD VALUE 'Decideur';

-- CreateTable
CREATE TABLE "statistics_sharing" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    "decision_maker_id" UUID NOT NULL,
    "created_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "statistics_sharing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "statistics_sharing_decision_maker_id_idx" ON "statistics_sharing"("decision_maker_id");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_sharing_structure_id_decision_maker_id_key" ON "statistics_sharing"("structure_id", "decision_maker_id");

-- AddForeignKey
ALTER TABLE "statistics_sharing" ADD CONSTRAINT "statistics_sharing_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics_sharing" ADD CONSTRAINT "statistics_sharing_decision_maker_id_fkey" FOREIGN KEY ("decision_maker_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics_sharing" ADD CONSTRAINT "statistics_sharing_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
