-- AlterEnum
ALTER TYPE "public"."UserActivityObject" ADD VALUE 'Minister';

-- DropForeignKey
ALTER TABLE "public"."social_support" DROP CONSTRAINT "social_support_minister_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."social_support" ADD CONSTRAINT "social_support_minister_id_fkey" FOREIGN KEY ("minister_id") REFERENCES "public"."minister"("id") ON DELETE SET NULL ON UPDATE CASCADE;
