/*
  Warnings:

  - You are about to drop the column `old_minister` on the `minister` table. All the data in the column will be lost.
  - You are about to drop the column `ministre` on the `social_support` table. All the data in the column will be lost.

*/

-- AlterTable
ALTER TABLE "public"."minister" DROP COLUMN "old_minister";

-- AlterTable
ALTER TABLE "public"."social_support" DROP COLUMN "ministre";

-- DropEnum
DROP TYPE "public"."Minister";
