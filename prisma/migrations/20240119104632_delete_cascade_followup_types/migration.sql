-- DropForeignKey
ALTER TABLE "followup_type" DROP CONSTRAINT "followup_type_owned_by_structured_id_fkey";

-- AddForeignKey
ALTER TABLE "followup_type" ADD CONSTRAINT "followup_type_owned_by_structured_id_fkey" FOREIGN KEY ("owned_by_structured_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
