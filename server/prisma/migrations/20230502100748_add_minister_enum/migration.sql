/*
  Warnings:

  - The `minister` column on the `beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Minister" AS ENUM ('FrancoisBraun', 'AgnesFirminLeBodo', 'JeanChristopheCombe', 'GenevieveDarrieussecq', 'OlivierDussopt', 'CaroleGrandjean');

-- AlterTable
ALTER TABLE "beneficiary" DROP COLUMN "minister",
ADD COLUMN     "minister" "Minister";
