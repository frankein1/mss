-- AlterTable
ALTER TABLE "archived_beneficiary" ADD COLUMN     "file_creation_date" TIMESTAMP(3),
ADD COLUMN     "file_instruction_count" INTEGER,
ADD COLUMN     "followup_count" INTEGER,
ADD COLUMN     "socialSupportSubjects" TEXT[],
ADD COLUMN     "structure_type" "StructureType";
