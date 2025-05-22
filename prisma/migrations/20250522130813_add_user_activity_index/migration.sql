-- Drop and CreateIndex
DROP INDEX IF EXISTS "user_activity_object_id_key_idx";
CREATE INDEX "user_activity_object_id_key_idx" ON "user_activity"("object_id", "key");
