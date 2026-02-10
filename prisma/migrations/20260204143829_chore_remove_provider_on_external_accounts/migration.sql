/*
  Warnings:

  - You are about to drop the column `provider` on the `external_account` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."external_account_provider_provider_account_id_key";

-- DropIndex
DROP INDEX "public"."external_account_user_id_type_provider_key";

-- AlterTable
ALTER TABLE "public"."external_account" DROP COLUMN "provider";
