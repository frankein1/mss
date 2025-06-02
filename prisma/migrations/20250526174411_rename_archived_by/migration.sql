-- DropForeignKey
ALTER TABLE "beneficiary" DROP CONSTRAINT "beneficiary_archived_by_id_fkey";


-- AlterTable
ALTER TABLE "beneficiary" 
DROP COLUMN "archived";

ALTER TABLE "beneficiary" 
RENAME COLUMN "archived_by_id" TO "disabled_by_id";


-- AddForeignKey
ALTER TABLE "beneficiary" 
ADD CONSTRAINT "beneficiary_disabled_by_id_fkey" 
FOREIGN KEY ("disabled_by_id") 
REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
