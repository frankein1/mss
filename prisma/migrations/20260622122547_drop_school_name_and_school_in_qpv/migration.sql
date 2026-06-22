/*
  Warnings:

  - You are about to drop the column `is_school_in_qpv` on the `beneficiary` table. All the data in the column will be lost.
  - You are about to drop the column `school_name` on the `beneficiary` table. All the data in the column will be lost.

*/

-- AlterTable
ALTER TABLE "beneficiary" 
DROP COLUMN "is_school_in_qpv",
DROP COLUMN "school_name";
