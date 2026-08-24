-- CreateEnum
CREATE TYPE "SupportProgramOutcome" AS ENUM ('NotAchieved', 'SubjectToConditions', 'Achieved', 'Exceeded');

-- AlterTable
ALTER TABLE "support_program" DROP COLUMN "precisions",
ADD COLUMN     "outcome" "SupportProgramOutcome";
