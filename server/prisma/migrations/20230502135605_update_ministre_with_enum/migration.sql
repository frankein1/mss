/*
  Warnings:

  - The `ministre` column on the `followup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ministre` column on the `help_request` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "followup" DROP COLUMN "ministre",
ADD COLUMN     "ministre" "Minister";

-- AlterTable
ALTER TABLE "help_request" DROP COLUMN "ministre",
ADD COLUMN     "ministre" "Minister";
