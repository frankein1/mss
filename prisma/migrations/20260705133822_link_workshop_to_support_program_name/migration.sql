/*
  Warnings:

  - You are about to drop the column `workshop_id` on the `support_program` table. All the data in the column will be lost.
  - Made the column `beneficiary_id` on table `support_program` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "support_program" DROP CONSTRAINT "support_program_workshop_id_fkey";

-- Custom migration code - Drop XOR constraint
ALTER TABLE "support_program" DROP CONSTRAINT "check_support_program_beneficiary_or_workshop";
-- End of Custom migration code

-- AlterTable
ALTER TABLE "support_program" DROP COLUMN "workshop_id",
ALTER COLUMN "beneficiary_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "workshop" ADD COLUMN     "support_program_name_id" UUID;

-- CreateIndex
CREATE INDEX "workshop_structure_id_idx" ON "workshop"("structure_id");

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_support_program_name_id_fkey" FOREIGN KEY ("support_program_name_id") REFERENCES "support_program_name"("id") ON DELETE SET NULL ON UPDATE CASCADE;


