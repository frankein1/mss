
-- AlterTable
ALTER TABLE "workshop" DROP COLUMN "name",
DROP COLUMN "structureId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" UUID NOT NULL,
ADD COLUMN     "structure_id" UUID NOT NULL,
ADD COLUMN     "workshop_name_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "workshop_name" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "created_by" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workshop_name_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workshop_name_structure_id_name_key" ON "workshop_name"("structure_id", "name");

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_workshop_name_id_fkey" FOREIGN KEY ("workshop_name_id") REFERENCES "workshop_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop_name" ADD CONSTRAINT "workshop_name_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop_name" ADD CONSTRAINT "workshop_name_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
