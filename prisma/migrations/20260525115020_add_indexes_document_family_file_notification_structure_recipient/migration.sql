-- CreateIndex
CREATE INDEX "document_family_file_id_idx" ON "public"."document"("family_file_id");

-- CreateIndex
CREATE INDEX "notification_structure_id_recipient_id_idx" ON "public"."notification"("structure_id", "recipient_id");
