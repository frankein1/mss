/*
  Warnings:

  - Added the required column `subject` to the `help_request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileInstructionType" AS ENUM ('Housing', 'Financial', 'Other');

-- AlterTable
ALTER TABLE "help_request" ADD COLUMN     "subject" "FileInstructionType";

update help_request set "subject" = 'Financial' where financial_support = true;

update help_request set "subject" = 'Other' where financial_support = false;

alter table help_request alter column "subject" set not null;