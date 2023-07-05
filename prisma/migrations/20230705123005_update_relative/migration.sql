-- DropForeignKey
ALTER TABLE "beneficiary_relative" DROP CONSTRAINT "beneficiary_relative_beneficiary_id_fkey";

-- AddForeignKey
ALTER TABLE "beneficiary_relative" ADD CONSTRAINT "beneficiary_relative_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
