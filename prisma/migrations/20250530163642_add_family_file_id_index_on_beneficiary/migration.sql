-- CreateIndex
CREATE INDEX "beneficiary_family_file_id_idx" ON "beneficiary"("family_file_id");

-- CreateIndex
CREATE INDEX "social_support_beneficiary_id_idx" ON "social_support"("beneficiary_id");
