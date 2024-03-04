/*
  Warnings:

  - You are about to drop the column `interventions` on the `followup` table. All the data in the column will be lost.
  - You are about to drop the column `signalements` on the `followup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "followup" DROP COLUMN "interventions",
DROP COLUMN "signalements";

-- DropEnum
DROP TYPE "FollowupIntervention";

-- DropEnum
DROP TYPE "FollowupSignalement";
