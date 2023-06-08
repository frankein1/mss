/*
  Warnings:

  - Added the required column `filename_disk` to the `document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document" ADD COLUMN     "filename_disk" TEXT NOT NULL;
