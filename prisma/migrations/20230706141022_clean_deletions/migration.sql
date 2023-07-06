-- DropForeignKey
ALTER TABLE "beneficiary" DROP CONSTRAINT "beneficiary_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_followup_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_help_request_id_fkey";

-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_beneficiary_id_fkey";

-- DropForeignKey
ALTER TABLE "followup" DROP CONSTRAINT "followup_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "followup_type" DROP CONSTRAINT "followup_type_owned_by_structured_id_fkey";

-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "instructor_organization" DROP CONSTRAINT "instructor_organization_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_beneficiary_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_document_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_followup_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_help_request_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "prescribing_organization" DROP CONSTRAINT "prescribing_organization_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_structure_id_fkey";

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup_type" ADD CONSTRAINT "followup_type_owned_by_structured_id_fkey" FOREIGN KEY ("owned_by_structured_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_help_request_id_fkey" FOREIGN KEY ("help_request_id") REFERENCES "help_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescribing_organization" ADD CONSTRAINT "prescribing_organization_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_organization" ADD CONSTRAINT "instructor_organization_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_help_request_id_fkey" FOREIGN KEY ("help_request_id") REFERENCES "help_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("key") ON DELETE CASCADE ON UPDATE CASCADE;
