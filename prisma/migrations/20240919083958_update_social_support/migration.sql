-- AlterTable
ALTER TABLE "social_support" ADD COLUMN     "last_updated_by_id" UUID,
ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "social_support" ADD CONSTRAINT "social_support_last_updated_by_id_fkey" FOREIGN KEY ("last_updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_support" ADD CONSTRAINT "social_support_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
