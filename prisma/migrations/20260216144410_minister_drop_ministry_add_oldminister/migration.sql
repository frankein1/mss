/*
  Warnings:

  - You are about to drop the column `former` on the `minister` table. All the data in the column will be lost.
  - You are about to drop the column `ministry` on the `minister` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[first_name,last_name,government,status]` on the table `minister` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `minister` table without a default value. This is not possible if the table is not empty.
  - Made the column `government` on table `minister` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."MinisterStatus" AS ENUM ('Current', 'Former', 'Deleted');

-- DropIndex
DROP INDEX "public"."minister_first_name_last_name_government_key";

-- AlterTable
ALTER TABLE "public"."minister" DROP COLUMN "former",
DROP COLUMN "ministry",
ADD COLUMN     "old_minister" "public"."Minister",
ADD COLUMN     "status" "public"."MinisterStatus" NOT NULL,
ALTER COLUMN "government" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "minister_first_name_last_name_government_status_key" ON "public"."minister"("first_name", "last_name", "government", "status");
