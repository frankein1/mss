-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_beneficiary_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_beneficiary_id_fkey";

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
