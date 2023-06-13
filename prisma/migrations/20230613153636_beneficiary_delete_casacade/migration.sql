-- DropForeignKey
ALTER TABLE "followup" DROP CONSTRAINT "followup_beneficiary_id_fkey";

-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_beneficiary_id_fkey";

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
