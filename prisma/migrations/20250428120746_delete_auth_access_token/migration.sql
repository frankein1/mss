/*
  Warnings:

  - You are about to drop the column `access_token` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `access_token_validity` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "access_token",
DROP COLUMN "access_token_validity";
