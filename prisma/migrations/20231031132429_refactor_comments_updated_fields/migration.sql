/*
  Warnings:

  - You are about to drop the column `updated_by_id` on the `comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_updated_by_id_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "updated_by_id";
