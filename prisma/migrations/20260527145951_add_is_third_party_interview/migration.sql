-- AlterTable
ALTER TABLE "public"."followup" ADD COLUMN     "is_third_party_interview" BOOLEAN DEFAULT false;

-- Migrate existing ThirdParty records
UPDATE "public"."followup" SET "is_third_party_interview" = true WHERE "medium" = 'ThirdParty';
