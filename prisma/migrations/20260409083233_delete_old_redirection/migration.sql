/*
  Warnings:

  - You are about to drop the column `redirected` on the `followup` table. All the data in the column will be lost.
  - You are about to drop the column `structure_name` on the `followup` table. All the data in the column will be lost.

*/

-- AlterTable
ALTER TABLE "public"."followup" 
DROP COLUMN "redirected",
DROP COLUMN "structure_name";
