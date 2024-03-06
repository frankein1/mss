-- DropForeignKey
ALTER TABLE "beneficiary" DROP CONSTRAINT "beneficiary_structure_id_fkey";

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
