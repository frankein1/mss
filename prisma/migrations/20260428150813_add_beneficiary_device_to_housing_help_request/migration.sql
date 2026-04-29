-- AlterTable
ALTER TABLE "public"."housing_help_request" ADD COLUMN     "beneficiary_device_id" UUID;

-- AddForeignKey
ALTER TABLE "public"."housing_help_request" ADD CONSTRAINT "housing_help_request_beneficiary_device_id_fkey" FOREIGN KEY ("beneficiary_device_id") REFERENCES "public"."beneficiary_device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
