-- AlterTable
ALTER TABLE "public"."followup" ADD COLUMN     "beneficiary_device_id" UUID;

-- AlterTable
ALTER TABLE "public"."help_request" ADD COLUMN     "beneficiary_device_id" UUID;

-- AddForeignKey
ALTER TABLE "public"."followup" ADD CONSTRAINT "followup_beneficiary_device_id_fkey" FOREIGN KEY ("beneficiary_device_id") REFERENCES "public"."beneficiary_device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."help_request" ADD CONSTRAINT "help_request_beneficiary_device_id_fkey" FOREIGN KEY ("beneficiary_device_id") REFERENCES "public"."beneficiary_device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
