-- AlterTable
ALTER TABLE "beneficiary" ALTER COLUMN "updated" DROP DEFAULT;

-- AlterTable
ALTER TABLE "beneficiary_relative" ALTER COLUMN "updated" DROP DEFAULT;

-- AlterTable
ALTER TABLE "followup" ALTER COLUMN "updated" DROP DEFAULT;

-- AlterTable
ALTER TABLE "help_request" ALTER COLUMN "updated" DROP DEFAULT;

-- AlterTable
ALTER TABLE "structure" ALTER COLUMN "updated" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updated" DROP DEFAULT;
