/*
  Warnings:

  - A unique constraint covering the columns `[user_id,type,provider]` on the table `external_account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "external_account_user_id_type_provider_key" ON "public"."external_account"("user_id", "type", "provider");
