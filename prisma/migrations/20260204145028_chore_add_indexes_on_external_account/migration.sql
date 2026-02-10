-- CreateIndex
CREATE UNIQUE INDEX "external_account_provider_provider_account_id_key" ON "public"."external_account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "external_account_user_id_provider_key" ON "public"."external_account"("user_id", "provider");
