-- CreateEnum
CREATE TYPE "AccomodationZone" AS ENUM ('france', 'eu', 'outside_eu');

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "accommodation_zone" "AccomodationZone",
ADD COLUMN     "numero_pegase" TEXT;
