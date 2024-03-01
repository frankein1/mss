-- CreateEnum
CREATE TYPE "FollowupDuration" AS ENUM ('Quarter', 'Half', 'ThreeQuarter', 'Hour', 'MoreThanHour');

-- AlterTable
ALTER TABLE "followup" ADD COLUMN     "duration" "FollowupDuration";
