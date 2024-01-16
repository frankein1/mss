-- AlterEnum
ALTER TYPE "UserActivityObject" ADD VALUE 'SocialSupport';

-- DropForeignKey
ALTER TABLE "followup" DROP CONSTRAINT "followup_social_support_id_fkey";

-- DropForeignKey
ALTER TABLE "help_request" DROP CONSTRAINT "help_request_social_support_id_fkey";

-- DropForeignKey
ALTER TABLE "housing_help_request" DROP CONSTRAINT "housing_help_request_social_support_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_social_support_id_fkey";

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing_help_request" ADD CONSTRAINT "housing_help_request_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_social_support_id_fkey" FOREIGN KEY ("social_support_id") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;
