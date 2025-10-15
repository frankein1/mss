/*
  Warnings:
  - Made the column `chargeable` on table `workshop` required. This step will fail if there are existing NULL values in that column.
*/

-- AlterTable
ALTER TABLE "public"."workshop" ALTER COLUMN "chargeable" SET NOT NULL;
