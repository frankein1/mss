/*
  Warnings:

  - You are about to drop the column `administration` on the `beneficiary` table. All the data in the column will be lost.
  - You are about to drop the column `minister` on the `beneficiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "beneficiary" DROP COLUMN "administration",
DROP COLUMN "minister";
