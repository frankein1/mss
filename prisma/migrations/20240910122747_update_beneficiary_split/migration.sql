-- AlterEnum
ALTER TYPE "UserActivityObject" ADD VALUE 'FamilyFile';

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "previous_family_file_id" UUID,
ADD COLUMN     "split_from_file_by_id" UUID;

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_previous_family_file_id_fkey" FOREIGN KEY ("previous_family_file_id") REFERENCES "family_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_split_from_file_by_id_fkey" FOREIGN KEY ("split_from_file_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
