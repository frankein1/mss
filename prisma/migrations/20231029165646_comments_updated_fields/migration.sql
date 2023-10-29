-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "updated" TIMESTAMP(3),
ADD COLUMN     "updated_by_id" UUID;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
