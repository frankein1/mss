/*
  Warnings:

  - You are about to drop the `draft` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "draft" DROP CONSTRAINT "draft_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "draft" DROP CONSTRAINT "draft_structure_id_fkey";

-- DropTable
DROP TABLE "draft";

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "draft" BOOLEAN NOT NULL DEFAULT false;

