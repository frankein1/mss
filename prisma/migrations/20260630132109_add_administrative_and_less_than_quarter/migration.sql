-- AlterEnum
ALTER TYPE "FollowupDuration" ADD VALUE 'LessThanQuarter';

-- AlterEnum
ALTER TYPE "FollowupMedium" ADD VALUE 'Administrative';

-- DropIndex
DROP INDEX "beneficiary_structure_id_birth_name_normalized_idx";

-- DropIndex
DROP INDEX "beneficiary_structure_id_first_name_normalized_idx";

-- DropIndex
DROP INDEX "beneficiary_structure_id_usual_name_normalized_idx";

-- DropIndex
DROP INDEX "followup_type_id_include_name_idx";
